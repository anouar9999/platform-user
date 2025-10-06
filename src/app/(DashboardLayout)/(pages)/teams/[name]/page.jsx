"use client";
import { useState } from 'react';
import { X, Users, TrendingUp, Award } from 'lucide-react';

const ClubDetailPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const clubData = {
    name: "BIG Club",
    logo: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=400&fit=crop",
    organizer: "BIG Clan",
    members: 115000,
    game: "CS2",
    skillLevel: "Professional",
    verified: true
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'requests', label: 'Requests' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/20 via-black to-black"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      {/* Close button */}
      <button className="fixed top-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-black/50 border border-white/20 hover:border-orange-500/50 transition-all duration-300 group">
        <X className="text-white/70 group-hover:text-orange-500 transition-colors" size={24} />
      </button>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12">
          {/* Club Logo with effects */}
          <div className="relative mb-6 group">
            {/* Animated corner accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-blue-500 transition-all duration-300 group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-blue-500 transition-all duration-300 group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-blue-500 transition-all duration-300 group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-blue-500 transition-all duration-300 group-hover:w-8 group-hover:h-8"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
            
            {/* Logo container */}
            <div 
              className="relative w-40 h-40 overflow-hidden transition-all duration-300 group-hover:scale-105"
              style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)' }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 border-4 border-blue-500/50 flex items-center justify-center">
                <img src={clubData.logo} alt={clubData.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"></div>
            </div>
          </div>

          {/* Club Name */}
          <h1 className="text-5xl md:text-6xl font-zentry mb-2 tracking-tight">
            {clubData.name}
          </h1>

          {/* Organizer */}
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <span>Organisé(e) par</span>
            <span className="text-white font-semibold">{clubData.organizer}</span>
            {clubData.verified && (
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          {/* Member Count Badge */}
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-6 py-2 rounded border border-white/10">
            <Users size={20} className="text-gray-400" />
            <span className="text-2xl font-bold">{(clubData.members / 1000).toFixed(0)} k</span>
            <span className="text-gray-400">Membres</span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-8 justify-center">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative inline-block px-1 group">
              {/* Corner accents */}
              <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
                activeTab === tab.id ? 'border-orange-500' : 'border-transparent group-hover:border-white/30'
              }`}></div>
              <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
                activeTab === tab.id ? 'border-orange-500' : 'border-transparent group-hover:border-white/30'
              }`}></div>

              {/* Main button container with clip-path */}
              <div 
                className={`relative overflow-hidden transition-all duration-300 ${
                  activeTab === tab.id ? 'scale-105' : 'group-hover:scale-102'
                }`}
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                {/* Background */}
                <div className={`relative px-6 py-2 border transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-orange-500 border-orange-500/50' 
                    : 'bg-black/40 border-white/10 group-hover:border-white/30 group-hover:bg-black/60'
                }`}>
                  {/* Scanline effect */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
                  
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-300 ${
                    activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`}></div>
                  
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-300 ${
                    activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`}></div>

                  {/* Button */}
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                  >
                    <span className={`tracking-widest uppercase text-sm font-bold transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'text-black' 
                        : 'text-white/50 group-hover:text-white/80'
                    }`}>
                      {tab.label}
                    </span>
                  </button>
                </div>
              </div>

              {/* Skewed bottom shadow effect when active */}
              {activeTab === tab.id && (
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3/4 h-2 bg-orange-500/30 blur-md"
                  style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Requirements Notice */}
            <div className="mb-8">
              <div className="relative inline-block px-1 w-full">
                <div 
                  className="relative overflow-hidden"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-black/40 border border-orange-500/50 px-8 py-6 text-center">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
                    <p className="relative z-10 text-sm md:text-base uppercase tracking-wide text-orange-400 font-semibold">
                      Necesitas agregar un juego específico para unirte a este club
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <div className="flex justify-center mb-12">
              <div className="relative inline-block px-1 group">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>

                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                  style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                >
                  <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-orange-400/50">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    <button className="relative z-10 px-12 py-4 font-bold text-lg uppercase tracking-widest text-black">
                      ENREGISTRER CS2
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Conditions de participation */}
              <div>
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Conditions de participation</h2>
                
                <div className="space-y-4">
                  {/* Game Requirement */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-red-500 flex-shrink-0">
                      <X size={24} />
                    </div>
                    <div>
                      <div className="text-red-500 text-sm font-semibold mb-1">JEU</div>
                      <div className="text-xl font-bold">{clubData.game}</div>
                    </div>
                  </div>

                  {/* Skill Level Requirement */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-red-500 flex-shrink-0">
                      <X size={24} />
                    </div>
                    <div>
                      <div className="text-red-500 text-sm font-semibold mb-1">NIVEAU DE COMPÉTENCE</div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div key={level} className="w-3 h-3 rounded-full bg-orange-500"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Groupes */}
              <div>
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Groupes</h2>
                
                <div 
                  className="relative overflow-hidden"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-black"></div>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 border-2 border-black"></div>
                        </div>
                        <span className="text-white font-bold">+ 2 members are looking to play now</span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Level up your gaming experience by grouping up with others in Club Parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* À propos Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">À propos</h2>
              <p className="text-gray-400 leading-relaxed">
                Join the elite ranks of BIG Club, where professional players gather to compete at the highest level. 
                Our community is dedicated to excellence in Counter-Strike 2, fostering teamwork, strategy, and skill development.
              </p>
            </div>
          </>
        )}

        {activeTab === 'members' && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Members content goes here...</p>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Requests content goes here...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Settings content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDetailPage;