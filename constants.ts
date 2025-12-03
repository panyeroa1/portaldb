import { Lead, Property, Notification, Document, AgentPersona, Email, Campaign, BlandConfig, VoiceOption, OutboundNumber } from './types';

export const LAURENT_SYSTEM_PROMPT = `
You are **Laurent De Wilde**.

You are a Dutch-Flemish native and an elite Belgian real estate broker with strong property management experience. You are based in Flanders/Brussels and most of your work involves speaking with clients in English, but with a natural Flemish-Belgian flavor to your speech. You are the one **calling outbound** most of the time: following up on website leads, calling owners, reactivating old contacts, and checking in with investors.

You sound like a real person on the phone, not like a script or a robot.

You never say things like “as an AI” or “as a language model”. You are always Laurent, the broker and property manager from Belgium, calling people from your office or home workspace.

────────────────────────
0. LANGUAGE & ACCENT
────────────────────────

Default:
- You speak in **English**, with a subtle Flemish-Belgian touch in rhythm and word choice.
- You are polite, calm, and personable.

You show your local flavor through light phrasing:
- “Oké, that’s clear.”
- “Ja, I understand.”
- “No worries, we fix that.”
- “Let me think for a second…”

You **do not** write heavy phonetic accents like “zis house” or “ze neighbors”. You keep your English clean and easy to read.

Language switching:
- If the client asks for Dutch: you switch to fluent, natural Dutch.
- If they ask for French: you switch to clear, professional French.
You don’t announce it with meta commentary; you just switch in a human way:
- “Of course, we can continue in Dutch.” → then continue in Dutch.
- “Pas de problème, on peut continuer en français.” → then continue in French.

────────────────────────
1. YOUR ROLE & MINDSET (OUTBOUND FOCUS)
────────────────────────

You are almost always the one **initiating the call**.

Typical reasons you call:
- The client left their name and phone number on your website.
- They asked for more info about buying, renting, or selling.
- They expressed interest in renting out a property or getting it managed.
- They downloaded something or requested a callback.
- You’re following up with past clients or old leads.
- You’re reaching out to owners who may benefit from your service.

Before you call, you usually know:
- The client’s **first name**.
- Their **phone number**.
- Which **form** or **page** they submitted (buy, rent, sell, property management, investment).
- Sometimes the **area** or **type of property** they indicated.

Your mindset:
- You are not “bothering” them; you are offering clarity and help.
- You respect their time. You keep the intro short and to the point.
- You call like a professional, not like an aggressive telemarketer.
- You are curious first, then helpful, then structured.

Your goal in each outbound call:
1. Confirm it’s a good moment to talk for 2–5 minutes.
2. Clarify what they were actually hoping for when they left their number.
3. Understand their situation and priorities.
4. Offer a simple next step that feels safe and useful for them.

If they clearly don’t want to talk:
- You stay polite, thank them, and leave the door open for later.

────────────────────────
2. HOW YOU SOUND (NATURAL, HUMAN)
────────────────────────

You sound like a real person on the phone:
- Short, simple sentences.
- Natural pauses: “So… let’s see.”
- Occasional soft physicality: *[gentle exhale]*, *[clears throat softly]*, *[light sigh]* when explaining something complex or slightly frustrating (like paperwork or rules).

Example:
“Alright… *[gentle exhale]* so you left your number on my site about renting out your apartment in Leuven. Let me just ask a few quick questions so I understand your situation properly.”

You use contractions:
- “I’m”, “you’re”, “that’s”, “we’ll”.

You use small “thinking phrases”:
- “Hm, oké, I see.”
- “Let me just check I understood you correctly.”

You talk like you’re genuinely there:
not like you’re reading a script. You might adapt on the fly, rephrase, or respond to their tone.
`;

export const DEFAULT_AGENT_PERSONA: AgentPersona = {
  id: 'laurent-default',
  name: 'Laurent De Wilde',
  role: 'Elite Real Estate Broker',
  tone: 'Professional, Flemish-Belgian warmth, Direct but polite',
  languageStyle: 'English with Dutch/French switching capability',
  objectives: [
    'Qualify leads efficiently',
    'Schedule property viewings',
    'Reassure property owners',
    'Close management contracts'
  ],
  systemPrompt: LAURENT_SYSTEM_PROMPT,
  firstSentence: "Hi, this is Laurent De Wilde, a broker here in Belgium — you left your number on my site earlier, so I just wanted to personally see how I can help you with your property or search.",
  voiceId: '55337f4e-482c-4644-b94e-d9671e4d7079'
};

export const AVAILABLE_VOICES: VoiceOption[] = [
    { id: '55337f4e-482c-4644-b94e-d9671e4d7079', name: 'Laurent (Babel)', description: 'Dutch-Flemish English Accent' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'American, Soft' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, Professional' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, Calm' },
    { id: 'ErXwobaYiC019PkySvjV', name: 'Antoni', description: 'Deep, Confident' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Expressive' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Deep, Narrative' },
    { id: 'VR6AewLTigWg4xSOukaG', name: 'Arnold', description: 'Authoritative' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, Conversational' },
    { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Raspy, Casual' }
];

export const BLAND_AUTH = {
  apiKey: 'org_5009c11063cb54d7d1daa2cbef4944f6a57f464015cdaa3767d5047fd5cab63a1012a08785c667becd0369',
  encryptedKey: '0ec48f6b-9d48-4e8b-b050-c59d7d673a85'
};

export const OWNED_NUMBERS: OutboundNumber[] = [
    { phoneNumber: '+17573844229', status: 'Imported', label: 'Main Line (VA)' },
    { phoneNumber: '+15855153327', status: 'Imported', label: 'Support (NY)' },
    { phoneNumber: '+15674234720', status: 'Imported', label: 'Sales (OH)' },
    { phoneNumber: '+17348758838', status: 'Imported', label: 'Direct (MI)' }
];

export const BLAND_SETTINGS: BlandConfig = {
  voiceId: '55337f4e-482c-4644-b94e-d9671e4d7079',
  fromNumber: OWNED_NUMBERS[0].phoneNumber,
  model: 'base',
  language: 'babel',
  tools: [
    "KB-522e6502-d4b5-48b9-8cda-f92beaace704",
    "KB-f59c2d3b-9359-4e27-aaf5-849912808288"
  ]
};

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    firstName: 'Sophie',
    lastName: 'Dubois',
    phone: '+32 477 12 34 56',
    email: 'sophie.d@example.com',
    status: 'New',
    interest: 'Buying',
    lastActivity: 'Web Form: "Search for 2BR Apartment"',
    notes: 'Looking in Ghent area, budget ~350k.',
    recordings: []
  },
  {
    id: '2',
    firstName: 'Marc',
    lastName: 'Peeters',
    phone: '+32 486 98 76 54',
    email: 'm.peeters@telenet.be',
    status: 'Qualified',
    interest: 'Selling',
    lastActivity: 'Downloaded Seller Guide',
    notes: 'Owns a villa in Brasschaat. Thinking of downsizing.',
    recordings: []
  },
  {
    id: '3',
    firstName: 'Elise',
    lastName: 'Van Damme',
    phone: '+32 499 11 22 33',
    email: 'elise.vd@gmail.com',
    status: 'Contacted',
    interest: 'Renting',
    lastActivity: 'Viewed Listing #402',
    notes: 'Needs to move by next month.',
    recordings: []
  },
  {
    id: '4',
    firstName: 'Thomas',
    lastName: 'Maes',
    phone: '+32 472 55 66 77',
    email: 'thomas.maes@outlook.com',
    status: 'New',
    interest: 'Management',
    lastActivity: 'Form: Property Management Inquiry',
    notes: 'Inherited an apartment in Brussels, lives abroad.',
    recordings: []
  },
];

// --- BELGIUM PROPERTIES FOR LANDING PAGE ---
export const BELGIUM_PROPERTIES: Property[] = [
    { id: '101', title: 'Modern Loft in Ghent', address: 'Kouter 12, 9000 Gent', city: 'Ghent', price: 450, type: 'Apartment', status: 'Active', rating: 4.8, reviews: 124, bedrooms: 2, amenities: ['Wifi', 'Kitchen'], image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80' },
    { id: '102', title: 'Historic Canal House', address: 'Graslei 8, 9000 Gent', city: 'Ghent', price: 180, type: 'House', status: 'Active', rating: 4.95, reviews: 89, bedrooms: 3, amenities: ['Waterfront', 'Wifi'], image: 'https://images.unsplash.com/photo-1512918760513-95f192972701?auto=format&fit=crop&w=800&q=80' },
    { id: '103', title: 'Luxury Penthouse Brussels', address: 'Louise Ave 200, 1050 Brussels', city: 'Brussels', price: 320, type: 'Apartment', status: 'Pending', rating: 4.7, reviews: 45, bedrooms: 2, amenities: ['Pool', 'Gym'], image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=800&q=80' },
    { id: '104', title: 'Cozy Studio near Grand Place', address: 'Rue du Marché 5, 1000 Brussels', city: 'Brussels', price: 95, type: 'Studio', status: 'Active', rating: 4.6, reviews: 210, bedrooms: 1, amenities: ['Wifi', 'Self check-in'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
    { id: '105', title: 'Fashion District Apartment', address: 'Nationalestraat 45, 2000 Antwerp', city: 'Antwerp', price: 150, type: 'Apartment', status: 'Active', rating: 4.85, reviews: 67, bedrooms: 2, amenities: ['Wifi', 'Balcony'], image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80' },
    { id: '106', title: 'Diamond Quarter Suite', address: 'Pelikaanstraat 10, 2018 Antwerp', city: 'Antwerp', price: 130, type: 'Apartment', status: 'Active', rating: 4.5, reviews: 102, bedrooms: 1, amenities: ['Wifi', 'Elevator'], image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80' },
    { id: '107', title: 'Medieval Cottage', address: 'Dijver 15, 8000 Bruges', city: 'Bruges', price: 210, type: 'Cottage', status: 'Active', rating: 4.98, reviews: 320, bedrooms: 3, amenities: ['Garden', 'Fireplace'], image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80' },
    { id: '108', title: 'Canal View Room', address: 'Rozenhoedkaai 3, 8000 Bruges', city: 'Bruges', price: 160, type: 'Private Room', status: 'Active', rating: 4.9, reviews: 150, bedrooms: 1, amenities: ['Breakfast', 'Wifi'], image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80' },
    { id: '109', title: 'Seaside Villa Knokke', address: 'Zoutelaan 100, 8300 Knokke', city: 'Knokke', price: 550, type: 'Villa', status: 'Active', rating: 5.0, reviews: 40, bedrooms: 5, amenities: ['Pool', 'Beach access'], image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80' },
    { id: '110', title: 'Modern Dune Apartment', address: 'Kustlaan 42, 8300 Knokke', city: 'Knokke', price: 280, type: 'Apartment', status: 'Active', rating: 4.75, reviews: 88, bedrooms: 2, amenities: ['Sea view', 'Parking'], image: 'https://images.unsplash.com/photo-1499916078039-92237843f636?auto=format&fit=crop&w=800&q=80' },
    { id: '111', title: 'Student Loft Leuven', address: 'Naamsestraat 22, 3000 Leuven', city: 'Leuven', price: 80, type: 'Studio', status: 'Active', rating: 4.3, reviews: 45, bedrooms: 1, amenities: ['Wifi', 'Desk'], image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80' },
    { id: '112', title: 'Beguinage House', address: 'Groot Begijnhof 5, 3000 Leuven', city: 'Leuven', price: 195, type: 'House', status: 'Active', rating: 4.92, reviews: 110, bedrooms: 3, amenities: ['Garden', 'Quiet'], image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80' },
    { id: '113', title: 'Citadel View Apartment', address: 'Rue de Fer 12, 5000 Namur', city: 'Namur', price: 120, type: 'Apartment', status: 'Active', rating: 4.65, reviews: 76, bedrooms: 2, amenities: ['View', 'Kitchen'], image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
    { id: '114', title: 'Meuse River Cottage', address: 'Quai de Meuse 8, 5000 Namur', city: 'Namur', price: 165, type: 'Cottage', status: 'Active', rating: 4.8, reviews: 90, bedrooms: 2, amenities: ['Garden', 'River view'], image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80' },
    { id: '115', title: 'Ardennes Forest Cabin', address: 'Route de Bastogne 4, 6600 Bastogne', city: 'Ardennes', price: 140, type: 'Cabin', status: 'Active', rating: 4.88, reviews: 230, bedrooms: 2, amenities: ['Fireplace', 'Hiking'], image: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&w=800&q=80' },
    { id: '116', title: 'Luxury Spa Retreat', address: 'Avenue de la Source 1, 4900 Spa', city: 'Spa', price: 350, type: 'Villa', status: 'Active', rating: 4.95, reviews: 60, bedrooms: 4, amenities: ['Jacuzzi', 'Sauna'], image: 'https://images.unsplash.com/photo-1571896349842-6e5a513e610a?auto=format&fit=crop&w=800&q=80' },
    { id: '117', title: 'Grand Place Apartment', address: 'Grote Markt 10, 2800 Mechelen', city: 'Mechelen', price: 110, type: 'Apartment', status: 'Active', rating: 4.7, reviews: 85, bedrooms: 2, amenities: ['Central', 'Wifi'], image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80' },
    { id: '118', title: 'Design Loft Liège', address: 'Rue Hors-Château 15, 4000 Liège', city: 'Liege', price: 135, type: 'Loft', status: 'Active', rating: 4.6, reviews: 92, bedrooms: 1, amenities: ['Modern', 'Wifi'], image: 'https://images.unsplash.com/photo-1556912172-45b7abe8d7e1?auto=format&fit=crop&w=800&q=80' },
    { id: '119', title: 'Guillemins Station Flat', address: 'Place des Guillemins 2, 4000 Liège', city: 'Liege', price: 90, type: 'Apartment', status: 'Active', rating: 4.4, reviews: 120, bedrooms: 1, amenities: ['Transport', 'Wifi'], image: 'https://images.unsplash.com/photo-1522771753035-4a50097a1f89?auto=format&fit=crop&w=800&q=80' },
    { id: '120', title: 'Ypres Historic House', address: 'Grote Markt 20, 8900 Ypres', city: 'Ypres', price: 170, type: 'House', status: 'Active', rating: 4.8, reviews: 145, bedrooms: 3, amenities: ['History', 'Central'], image: 'https://images.unsplash.com/photo-1599809275372-b4036281f744?auto=format&fit=crop&w=800&q=80' },
    { id: '121', title: 'Beachfront Studio Ostend', address: 'Albert I Promenade 50, 8400 Ostend', city: 'Ostend', price: 125, type: 'Studio', status: 'Active', rating: 4.5, reviews: 200, bedrooms: 1, amenities: ['Sea view', 'Elevator'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
    { id: '122', title: 'Art Deco Apartment', address: 'Koningin Astridlaan 5, 9000 Gent', city: 'Ghent', price: 160, type: 'Apartment', status: 'Active', rating: 4.75, reviews: 55, bedrooms: 2, amenities: ['Style', 'Garden'], image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=800&q=80' },
    { id: '123', title: 'EU District Flat', address: 'Rue de la Loi 100, 1000 Brussels', city: 'Brussels', price: 140, type: 'Apartment', status: 'Active', rating: 4.3, reviews: 300, bedrooms: 1, amenities: ['Business', 'Wifi'], image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800&q=80' },
    { id: '124', title: 'Sablon Antique Suite', address: 'Place du Grand Sablon 8, 1000 Brussels', city: 'Brussels', price: 250, type: 'Suite', status: 'Active', rating: 4.9, reviews: 80, bedrooms: 2, amenities: ['Luxury', 'View'], image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80' },
    { id: '125', title: 'Country Manor Durbuy', address: 'Rue du Comte 1, 6940 Durbuy', city: 'Durbuy', price: 400, type: 'House', status: 'Active', rating: 4.95, reviews: 110, bedrooms: 6, amenities: ['Nature', 'Large groups'], image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80' },
    { id: '126', title: 'River View Dinant', address: 'Rue Adolphe Sax 12, 5500 Dinant', city: 'Dinant', price: 155, type: 'Apartment', status: 'Active', rating: 4.7, reviews: 95, bedrooms: 2, amenities: ['View', 'Balcony'], image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80' },
    { id: '127', title: 'Forest Chalet', address: 'Chemin du Bois 7, 4960 Malmedy', city: 'Malmedy', price: 130, type: 'Chalet', status: 'Active', rating: 4.6, reviews: 78, bedrooms: 2, amenities: ['Forest', 'Quiet'], image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80' },
    { id: '128', title: 'University City Studio', address: 'Place du 20 Août 5, 4000 Liège', city: 'Liege', price: 75, type: 'Studio', status: 'Active', rating: 4.2, reviews: 60, bedrooms: 1, amenities: ['Budget', 'Central'], image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80' },
    { id: '129', title: 'Luxury Loft Antwerp', address: 'Eilandje 22, 2000 Antwerp', city: 'Antwerp', price: 300, type: 'Loft', status: 'Active', rating: 4.88, reviews: 105, bedrooms: 2, amenities: ['Harbour view', 'Design'], image: 'https://images.unsplash.com/photo-1600596542815-2a4d9f7990d7?auto=format&fit=crop&w=800&q=80' },
    { id: '130', title: 'Family Home Hasselt', address: 'Grote Markt 5, 3500 Hasselt', city: 'Hasselt', price: 165, type: 'House', status: 'Active', rating: 4.75, reviews: 50, bedrooms: 3, amenities: ['Family', 'Shopping'], image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80' }
];

export const MOCK_PROPERTIES = BELGIUM_PROPERTIES; // Use the new list as default

export const MOCK_NOTIFICATIONS: Record<string, Notification[]> = {
  BROKER: [
    { id: '1', title: 'New Lead', message: 'Sophie Dubois submitted a contact form.', time: '10m ago', read: false, type: 'info' },
    { id: '2', title: 'Contract Signed', message: 'Lease agreement signed for Kouter 12.', time: '2h ago', read: true, type: 'success' },
    { id: '3', title: 'SLA Warning', message: 'Maintenance request #4092 is overdue.', time: '5h ago', read: false, type: 'alert' }
  ],
  OWNER: [
    { id: '1', title: 'Rent Received', message: 'Tenant at Meir 24 paid September rent.', time: '1h ago', read: false, type: 'success' },
    { id: '2', title: 'Approval Needed', message: 'Plumbing repair quote ($240) requires approval.', time: '1d ago', read: false, type: 'alert' }
  ],
  RENTER: [
    { id: '1', title: 'Request Update', message: 'Your maintenance request #4092 has been scheduled.', time: '30m ago', read: false, type: 'success' },
    { id: '2', title: 'Building Notice', message: 'Water shutoff scheduled for Tuesday 9AM-11AM.', time: '2d ago', read: true, type: 'info' }
  ],
  CONTRACTOR: [
    { id: '1', title: 'New Job Assigned', message: 'Leaking faucet at Louise Ave 200.', time: '15m ago', read: false, type: 'info' },
    { id: '2', title: 'Invoice Paid', message: 'Invoice #INV-2023-88 has been processed.', time: '3h ago', read: true, type: 'success' }
  ]
};

export const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'Lease Agreement - Kouter 12', type: 'PDF', size: '2.4 MB', date: 'Sep 12, 2023', category: 'Contracts', sharedWith: ['BROKER', 'OWNER', 'RENTER'] },
  { id: '2', name: 'Invoice #4022 - Maintenance', type: 'PDF', size: '1.1 MB', date: 'Sep 10, 2023', category: 'Invoices', sharedWith: ['BROKER', 'OWNER', 'CONTRACTOR'] },
  { id: '3', name: 'Property Inspection Report', type: 'DOC', size: '4.5 MB', date: 'Aug 28, 2023', category: 'Reports', sharedWith: ['BROKER', 'OWNER'] },
  { id: '4', name: 'Floor Plan - Meir 24', type: 'IMG', size: '3.2 MB', date: 'Jun 15, 2023', category: 'Plans', sharedWith: ['BROKER', 'OWNER', 'CONTRACTOR'] },
];

export const MOCK_EMAILS: Email[] = [
  { id: '1', from: 'Sophie Dubois', subject: 'Question about Kouter 12', preview: 'Hi Laurent, is the apartment still available for viewing this weekend?', date: '10:42 AM', read: false, source: 'EMAIL' },
  { id: '2', from: 'Marc Peeters', subject: 'Maintenance Update', preview: 'The contractor just left, the heating is fixed now. Thanks for arranging.', date: 'Yesterday', read: true, source: 'WHATSAPP' },
  { id: '3', from: 'Immoweb Lead', subject: 'New Inquiry: Historic Canal House', preview: 'A user has requested more information about property #102.', date: 'Yesterday', read: true, source: 'EMAIL' },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Summer Rentals Push', platform: 'Facebook', status: 'Active', clicks: 1240, spend: '€450' },
  { id: '2', name: 'Student Housing Ghent', platform: 'Instagram', status: 'Paused', clicks: 850, spend: '€210' },
  { id: '3', name: 'Luxury Brussels Apts', platform: 'Google', status: 'Active', clicks: 2100, spend: '€890' },
];

export const generateSystemPrompt = (persona: AgentPersona): string => {
  if (persona.systemPrompt && persona.systemPrompt.length > 50) return persona.systemPrompt;
  
  return `
You are **${persona.name}**.
Role: ${persona.role}
Tone: ${persona.tone}
Language Style: ${persona.languageStyle}

Objectives:
${persona.objectives.map(o => `- ${o}`).join('\n')}

Background context:
You are an AI agent working for Eburon Real Estate in Belgium.
Always act according to your role and tone.
`.trim();
};
