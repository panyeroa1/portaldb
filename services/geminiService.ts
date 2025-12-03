
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { createPcmBlob, decode, decodeAudioData } from './audioUtils';
import { LAURENT_SYSTEM_PROMPT } from '../constants';

// Define the Tool for Property Filtering
const filterPropertiesTool: FunctionDeclaration = {
  name: 'filterProperties',
  description: 'Filter the list of properties based on user location, price, and type preferences.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING, description: 'City name in Belgium (e.g., Ghent, Brussels, Antwerp)' },
      maxPrice: { type: Type.NUMBER, description: 'Maximum price per night in Euros' },
      propertyType: { type: Type.STRING, description: 'Type of property (Apartment, House, Villa, etc.)' },
      bedrooms: { type: Type.NUMBER, description: 'Minimum number of bedrooms' }
    },
  }
};

export class GeminiLiveClient {
  private ai: GoogleGenAI | null = null;
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private nextStartTime: number = 0;
  private sources: Set<AudioBufferSourceNode> = new Set();
  
  // Recording
  private mediaRecorder: MediaRecorder | null = null;
  private recordingDestination: MediaStreamAudioDestinationNode | null = null;
  private recordedChunks: Blob[] = [];

  public onVolumeChange: ((inputVol: number, outputVol: number) => void) | null = null;
  public onClose: (() => void) | null = null;
  public onToolCall: ((functionCall: any) => void) | null = null; // New Callback

  constructor() {
    // Client is initialized in connect()
  }

  // Updated to accept optional custom system prompt, voice name, and tool definitions
  async connect(customSystemPrompt?: string, voiceName: string = 'Zephyr', useTools: boolean = false) {
    this.disconnect(); // Clean up existing

    // Initialize AI Client here to ensure we get the latest process.env.API_KEY
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
        console.error("API_KEY is missing in process.env");
    }
    this.ai = new GoogleGenAI({ apiKey });

    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.error("Microphone access denied", e);
      throw e;
    }

    // Setup Recording Mixer in Output Context (Output Context is 24kHz, Input is 16kHz)
    if (this.outputAudioContext && this.stream) {
        this.recordingDestination = this.outputAudioContext.createMediaStreamDestination();
        const micSource = this.outputAudioContext.createMediaStreamSource(this.stream);
        micSource.connect(this.recordingDestination);
    }

    const config: any = {
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: this.handleOpen.bind(this),
        onmessage: this.handleMessage.bind(this),
        onerror: (e: ErrorEvent) => {
            console.error('Gemini Error:', e);
        },
        onclose: (e: CloseEvent) => {
            console.log('Gemini Session Closed', e);
            if(this.onClose) this.onClose();
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
        },
        systemInstruction: customSystemPrompt || LAURENT_SYSTEM_PROMPT,
      },
    };

    if (useTools) {
        config.config.tools = [{ functionDeclarations: [filterPropertiesTool] }];
    }

    if (this.ai && this.ai.live) {
        this.sessionPromise = this.ai.live.connect(config);
    }
  }

  private handleOpen() {
    console.log('Gemini Live Connected');
    
    if (this.inputAudioContext && this.inputAudioContext.state === 'suspended') {
        this.inputAudioContext.resume();
    }
    if (this.outputAudioContext && this.outputAudioContext.state === 'suspended') {
        this.outputAudioContext.resume();
    }

    if (!this.inputAudioContext || !this.stream) return;

    const source = this.inputAudioContext.createMediaStreamSource(this.stream);
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
      const rms = Math.sqrt(sum / inputData.length);
      if(this.onVolumeChange) this.onVolumeChange(rms * 5, 0); 

      const pcmBlob = createPcmBlob(inputData);
      
      if (this.sessionPromise) {
        this.sessionPromise.then((session) => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      }
    };

    source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);
  }

  private async handleMessage(message: LiveServerMessage) {
    // 1. Handle Audio Output
    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;

    if (base64Audio && this.outputAudioContext) {
      this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);

      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        this.outputAudioContext,
        24000,
        1
      );

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      const gainNode = this.outputAudioContext.createGain();
      
      const analyser = this.outputAudioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(gainNode);
      gainNode.connect(analyser);
      
      gainNode.connect(this.outputAudioContext.destination);
      
      if (this.recordingDestination) {
          gainNode.connect(this.recordingDestination);
      }

      if(this.onVolumeChange) {
          this.onVolumeChange(0, 0.5); 
          setTimeout(() => { if(this.onVolumeChange) this.onVolumeChange(0, 0); }, audioBuffer.duration * 1000);
      }

      source.addEventListener('ended', () => {
        this.sources.delete(source);
      });

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      this.sources.add(source);
    }

    // 2. Handle Tool Calls
    if (message.toolCall) {
        for (const fc of message.toolCall.functionCalls) {
            console.log('Gemini Tool Call:', fc.name, fc.args);
            if (this.onToolCall) {
                this.onToolCall(fc);
            }
            
            // Respond to tool call to keep session alive
            if (this.sessionPromise) {
                this.sessionPromise.then(session => {
                    session.sendToolResponse({
                        functionResponses: {
                            id: fc.id,
                            name: fc.name,
                            response: { result: "Filter applied successfully." }
                        }
                    });
                });
            }
        }
    }

    const interrupted = message.serverContent?.interrupted;
    if (interrupted) {
      console.log("Model interrupted");
      this.stopAllAudio();
    }
  }

  private stopAllAudio() {
    this.sources.forEach(s => {
        try { s.stop(); } catch(e) {}
    });
    this.sources.clear();
    this.nextStartTime = 0;
  }

  startRecording() {
    if (!this.recordingDestination) return;
    this.recordedChunks = [];
    
    try {
        this.mediaRecorder = new MediaRecorder(this.recordingDestination.stream);
    } catch (e) {
        console.error("MediaRecorder init failed", e);
        return;
    }

    this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
        }
    };
    
    this.mediaRecorder.start();
  }

  async stopRecording(): Promise<string> {
    return new Promise((resolve) => {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
            resolve('');
            return;
        }

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            this.recordedChunks = [];
            resolve(url);
        };
        
        this.mediaRecorder.stop();
    });
  }

  disconnect() {
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.inputAudioContext) {
      this.inputAudioContext.close();
      this.inputAudioContext = null;
    }
    if (this.outputAudioContext) {
      this.outputAudioContext.close();
      this.outputAudioContext = null;
    }
    
    this.sessionPromise = null;
    this.mediaRecorder = null;
    this.recordingDestination = null;
  }
}

export const geminiClient = new GeminiLiveClient();
