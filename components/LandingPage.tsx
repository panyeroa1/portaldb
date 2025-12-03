
import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Menu, User, Mic, Heart, Star, MapPin, X, Loader2, Play } from 'lucide-react';
import { BELGIUM_PROPERTIES, OWNED_NUMBERS } from '../constants';
import { Property, AudioVolume } from '../types';
import { geminiClient } from '../services/geminiService';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [properties, setProperties] = useState<Property[]>(BELGIUM_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(BELGIUM_PROPERTIES);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [audioVols, setAudioVols] = useState<AudioVolume>({ input: 0, output: 0 });
  const [activeFilter, setActiveFilter] = useState<{ location?: string, maxPrice?: number }>({});
  
  // Orb state
  const [orbScale, setOrbScale] = useState(1);

  useEffect(() => {
      // Ask for location permission on mount
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  console.log("Location Access Granted", position.coords);
                  // In a real app, we'd calculate distance to properties here
              },
              (error) => console.log("Location Access Denied")
          );
      }

      geminiClient.onVolumeChange = (inVol, outVol) => {
          setAudioVols({ input: inVol, output: outVol });
          setOrbScale(1 + Math.max(inVol, outVol) * 1.5);
      };

      geminiClient.onToolCall = (toolCall) => {
          if (toolCall.name === 'filterProperties') {
              const { location, maxPrice, propertyType, bedrooms } = toolCall.args;
              handleFilter(location, maxPrice, propertyType, bedrooms);
          }
      };

      return () => {
          geminiClient.disconnect();
      };
  }, []);

  const handleFilter = (location?: string, maxPrice?: number, type?: string, bedrooms?: number) => {
      console.log("Filtering:", { location, maxPrice, type, bedrooms });
      setActiveFilter({ location, maxPrice }); // For UI feedback

      let result = [...properties];
      
      if (location) {
          result = result.filter(p => p.city.toLowerCase().includes(location.toLowerCase()) || p.address.toLowerCase().includes(location.toLowerCase()));
      }
      if (maxPrice) {
          result = result.filter(p => p.price <= maxPrice);
      }
      if (type) {
          result = result.filter(p => p.type.toLowerCase().includes(type.toLowerCase()));
      }
      if (bedrooms) {
          result = result.filter(p => p.bedrooms >= bedrooms);
      }

      setFilteredProperties(result);
  };

  const toggleVoiceSearch = async () => {
      if (isVoiceActive) {
          setIsVoiceActive(false);
          geminiClient.disconnect();
      } else {
          setIsVoiceActive(true);
          const systemPrompt = `You are a helpful travel assistant for Eburon, an Airbnb-style platform for Belgium.
          Your goal is to help users find a property.
          
          1. Ask the user what they are looking for (Location, Price, Type, Bedrooms).
          2. Use the 'filterProperties' tool to update the screen when you have enough info.
          3. Be brief, friendly, and enthusiastic about Belgium.
          
          Current Location Context: Belgium.
          Available Cities in Database: Ghent, Brussels, Antwerp, Bruges, Knokke, Leuven, Namur, Liege.
          `;
          
          await geminiClient.connect(systemPrompt, 'Orus', true);
      }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">E</div>
              <span className="text-xl font-bold tracking-tight text-emerald-800 hidden md:block">Eburon</span>
          </div>

          {/* Desktop Search Bar (Visual Only) */}
          <div className="hidden md:flex items-center shadow-sm border border-slate-300 rounded-full py-2.5 px-4 gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="font-medium text-sm pl-2">Anywhere</div>
              <div className="h-6 w-[1px] bg-slate-300"></div>
              <div className="font-medium text-sm">Any week</div>
              <div className="h-6 w-[1px] bg-slate-300"></div>
              <div className="text-slate-500 text-sm font-light">Add guests</div>
              <div className="bg-emerald-500 p-2 rounded-full text-white">
                  <Search className="w-4 h-4" />
              </div>
          </div>

          <div className="flex items-center gap-4">
              <button onClick={onLoginClick} className="text-sm font-medium hover:bg-slate-50 px-4 py-2 rounded-full transition-colors">
                  Switch to Hosting
              </button>
              <button className="p-2 hover:bg-slate-50 rounded-full">
                  <Globe className="w-5 h-5 text-slate-600" />
              </button>
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 border border-slate-300 rounded-full p-1 pl-3 hover:shadow-md transition-shadow"
              >
                  <Menu className="w-4 h-4 text-slate-600" />
                  <div className="bg-slate-500 rounded-full p-1 text-white">
                      <User className="w-5 h-5 fill-current" />
                  </div>
              </button>
          </div>
      </header>

      {/* Hero / Filter Bar for Mobile */}
      <div className="pt-24 pb-4 px-6 md:hidden">
          <div className="flex items-center shadow-md border border-slate-200 rounded-full p-3 gap-3">
              <Search className="w-5 h-5 text-slate-500 ml-2" />
              <div className="flex-1">
                  <div className="font-medium text-sm">Where to?</div>
                  <div className="text-xs text-slate-500">Anywhere • Any week • Add guests</div>
              </div>
              <div className="p-2 border rounded-full">
                  <Menu className="w-4 h-4" />
              </div>
          </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 md:pt-28 px-6 pb-20 max-w-[1600px] mx-auto">
          
          {/* Active Filter Chips */}
          {(activeFilter.location || activeFilter.maxPrice) && (
              <div className="flex gap-2 mb-6 animate-in fade-in slide-in-from-top-2">
                  {activeFilter.location && (
                      <span className="px-4 py-2 rounded-full bg-slate-100 text-sm font-medium flex items-center gap-2">
                          {activeFilter.location} <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilter(undefined, activeFilter.maxPrice)} />
                      </span>
                  )}
                  {activeFilter.maxPrice && (
                      <span className="px-4 py-2 rounded-full bg-slate-100 text-sm font-medium flex items-center gap-2">
                          Max €{activeFilter.maxPrice} <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilter(activeFilter.location, undefined)} />
                      </span>
                  )}
                  <button onClick={() => handleFilter()} className="text-sm text-slate-500 underline">Clear all</button>
              </div>
          )}

          {/* Voice FAB */}
          <div className="fixed bottom-8 right-1/2 transform translate-x-1/2 z-50">
              <button 
                onClick={toggleVoiceSearch}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-300 ${
                    isVoiceActive ? 'bg-black text-white w-auto px-8' : 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white hover:scale-105'
                }`}
              >
                  {isVoiceActive ? (
                      <>
                          <div className="flex items-center gap-1 h-4">
                              <div className="w-1 bg-white animate-pulse h-2"></div>
                              <div className="w-1 bg-white animate-pulse h-4 delay-75"></div>
                              <div className="w-1 bg-white animate-pulse h-3 delay-150"></div>
                          </div>
                          <span className="font-bold">Listening...</span>
                      </>
                  ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span className="font-bold">Ask Eburon</span>
                      </>
                  )}
              </button>
          </div>

          {/* Overlay Visualizer */}
          {isVoiceActive && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex flex-col items-center justify-center animate-in fade-in duration-300" onClick={toggleVoiceSearch}>
                  <div className="relative pointer-events-none">
                      {/* Orb */}
                      <div 
                        className="w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 blur-lg transition-transform duration-75 ease-linear"
                        style={{ transform: `scale(${orbScale})` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <Mic className="w-12 h-12 text-white" />
                      </div>
                  </div>
                  <p className="text-white font-medium text-lg mt-8 drop-shadow-md">"Show me lofts in Ghent under €200"</p>
              </div>
          )}

          {/* Property Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                      <div key={property.id} className="group cursor-pointer">
                          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-200 mb-3">
                              <img 
                                src={property.image} 
                                alt={property.title} 
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 right-3">
                                  <Heart className="w-6 h-6 text-white/70 hover:text-white hover:fill-white/50 transition-colors" />
                              </div>
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                  {property.type}
                              </div>
                          </div>
                          <div className="flex justify-between items-start">
                              <h3 className="font-bold text-slate-900 truncate">{property.city}, Belgium</h3>
                              <div className="flex items-center gap-1 text-sm">
                                  <Star className="w-3 h-3 fill-slate-900 text-slate-900" />
                                  <span>{property.rating}</span>
                              </div>
                          </div>
                          <p className="text-slate-500 text-sm truncate">{property.title}</p>
                          <p className="text-slate-500 text-sm">Oct 23 - 28</p>
                          <div className="mt-1.5 flex items-baseline gap-1">
                              <span className="font-bold text-slate-900">€{property.price}</span>
                              <span className="text-slate-900">night</span>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                      <Search className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium">No properties found</p>
                      <button onClick={() => handleFilter()} className="mt-4 text-emerald-600 font-bold hover:underline">Clear Filters</button>
                  </div>
              )}
          </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10 px-6">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-slate-600">
              <div>
                  <h4 className="font-bold text-slate-900 mb-4">Support</h4>
                  <ul className="space-y-3">
                      <li>Help Center</li>
                      <li>AirCover</li>
                      <li>Anti-discrimination</li>
                      <li>Disability support</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 mb-4">Hosting</h4>
                  <ul className="space-y-3">
                      <li>Eburon your home</li>
                      <li>AirCover for Hosts</li>
                      <li>Hosting resources</li>
                      <li>Community forum</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 mb-4">Eburon</h4>
                  <ul className="space-y-3">
                      <li>Newsroom</li>
                      <li>New features</li>
                      <li>Careers</li>
                      <li>Investors</li>
                  </ul>
              </div>
              <div>
                  <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-4 h-4" />
                      <span className="font-bold">English (BE)</span>
                      <span className="font-bold ml-4">€ EUR</span>
                  </div>
                  <p>© 2024 Eburon, Inc.</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
