"use client";
import { useState, useEffect } from 'react';
import { X, Users, Trophy, Star, Target, Medal, Search, Check, Loader2, UserPlus, Users2, MessageCircle, Image, Trash, AlertTriangle, Settings, Upload, Save } from 'lucide-react';

const ClubDetailPage = ({ onClose, onTeamUpdate, teamId: propTeamId, userId: propUserId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [teamId, setTeamId] = useState(propTeamId);
  const [userId, setUserId] = useState(propUserId);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    tag: '',
    description: '',
    game_id: 1,
    division: 'Silver',
    tier: 'amateur',
    contact_email: '',
    discord: '',
    twitter: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  
  const API_URL = 'http://localhost';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    ...(isOwner ? [{ id: 'requests', label: 'Requests' }] : []),
    ...(isOwner ? [{ id: 'settings', label: 'Settings' }] : []),
  ];

  const defaultAvatarSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1F2937;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r="64" fill="url(#grad)"/>
      <path d="M108 128C108 103.699 88.3005 84 64 84C39.6995 84 20 103.699 20 128" fill="#374151"/>
      <circle cx="64" cy="50" r="24" fill="#4B5563"/>
    </svg>
  `;

  useEffect(() => {
    if (teamStats) {
      setSettingsForm({
        name: teamStats.name || '',
        tag: teamStats.tag || '',
        description: teamStats.description || '',
        game_id: teamStats.game_id || 1,
        division: teamStats.division || 'Silver',
        tier: teamStats.tier || 'amateur',
        contact_email: teamStats.contact_email || '',
        discord: teamStats.discord || '',
        twitter: teamStats.twitter || '',
      });
      setLogoPreview(teamStats.logo ? `${API_URL}/${teamStats.logo}` : null);
      setBannerPreview(teamStats.banner ? `${API_URL}/${teamStats.banner}` : null);
    }
  }, [teamStats]);

  useEffect(() => {
    if (teamId && userId) {
      fetchTeamData();
    } else {
      setLoading(false);
      setError('Missing team or user information');
    }
  }, [teamId, userId]);

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);

    try {
      const mockTeamStats = {
        id: teamId,
        name: 'Elite Gamers',
        logo: null,
        banner: null,
        owner_id: '1',
        total_members: 12,
        win_rate: 67,
        wins: 45,
        losses: 22,
        tier: 'Professional',
        division: 'Gold',
        tag: 'ELG',
        description: 'A competitive gaming team focused on excellence',
        contact_email: 'contact@elitegamers.com',
        discord: 'discord.gg/elitegamers',
        twitter: '@elitegamers'
      };

      const mockMembers = [
        { id: 1, user_id: '1', username: 'Player1', avatar: null, role: 'Captain' },
        { id: 2, user_id: '2', username: 'Player2', avatar: null, role: 'Support' },
        { id: 3, user_id: '3', username: 'Player3', avatar: null, role: 'DPS' },
      ];

      const mockRequests = [
        { id: 1, user_id: '4', name: 'NewPlayer1', avatar: null, rank: 'Gold' },
        { id: 2, user_id: '5', name: 'NewPlayer2', avatar: null, rank: 'Silver' },
      ];

      setTeamStats(mockTeamStats);
      setMembers(mockMembers);
      setRequests(mockRequests);
      
      const userIsMember = mockMembers.some(member => String(member.user_id) === String(userId));
      setIsMember(userIsMember);
      
      const ownerCheck = String(mockTeamStats.owner_id) === String(userId);
      setIsOwner(ownerCheck);
      
      const userRequest = mockRequests.find(req => String(req.user_id) === String(userId));
      setHasRequested(!!userRequest);
      
    } catch (err) {
      setError('Failed to load team data. Please try again.');
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(true);
    console.log(`${action} request ${requestId}`);
    setTimeout(() => {
      setRequests(prev => prev.filter(req => req.id !== requestId));
      setActionLoading(false);
    }, 1000);
  };

  const handleJoinTeamRequest = async () => {
    setJoinLoading(true);
    console.log('Sending join request...');
    setTimeout(() => {
      setHasRequested(true);
      setJoinLoading(false);
    }, 1000);
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    console.log('Saving settings...', settingsForm);
    setTimeout(() => {
      setSettingsLoading(false);
    }, 1000);
  };

  const handleDeleteTeam = async () => {
    console.log('Deleting team...');
    if (onClose) onClose();
  };

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMembers = members.filter(member =>
    member.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchTeamData}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Image Section */}
      <div className="absolute top-0 left-0 right-0 h-screen z-0">
        <div className="relative w-full h-full">
          <img
            src={teamStats?.banner ? `${API_URL}/${teamStats.banner}` : 'https://framerusercontent.com/images/t7ZowO33lGwkXjvFtZPiTbxFwc.jpg?scale-down-to=1024'}
            alt="Team Background"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900 to-gray-900"></div>
          <div className="absolute top-0 left-0 bottom-0 w-32 sm:w-48 md:w-64 lg:w-80 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
      
      {/* Close button */}
      <button 
        onClick={onClose}
        className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-900/50 border border-white/20 hover:border-orange-500/50 transition-all duration-300 group"
      >
        <X className="text-white/70 group-hover:text-orange-500 transition-colors" size={20} />
      </button>

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          {/* Club Logo */}
          <div className="relative mb-4 sm:mb-6 group">
            <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
            <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
            <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
            <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
            
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
            
            <div 
              className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 overflow-hidden transition-all duration-300 group-hover:scale-105"
              style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)' }}
            >
              <div className="w-full h-full bg-gradient-to-br from-orange-500/60 to-orange-500/80 border-2 sm:border-4 border-orange-500/50 flex items-center justify-center">
                <img 
                  src={teamStats?.logo ? `${API_URL}/${teamStats.logo}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
                  alt={teamStats?.name || 'Team logo'} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"></div>
            </div>
          </div>

          {/* Club Name */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight text-center px-4">
            {teamStats?.name || 'Team Name'}
          </h1>

          {/* Organizer */}
          <div className="flex items-center gap-2 text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
            <span>Organisé(e) par</span>
            <span className="text-orange-500 font-semibold">Team Owner</span>
          </div>

          {/* Member Count Badge */}
          <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm px-4 sm:px-6 py-2 rounded border border-white/10">
            <Users size={16} className="text-gray-400 sm:w-5 sm:h-5" />
            <span className="text-xl sm:text-2xl font-bold">{teamStats?.total_members || 0}</span>
            <span className="text-gray-400 text-sm sm:text-base">Membres</span>
          </div>

          {/* Join Team Button - Only for non-owners */}
          {!isOwner && !isMember && (
            <div className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-none sm:w-auto">
              <div className="relative inline-block px-1 group w-full">
                <div className="absolute -top-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-3 group-hover:h-3 sm:group-hover:w-4 sm:group-hover:h-4"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-3 group-hover:h-3 sm:group-hover:w-4 sm:group-hover:h-4"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-3 group-hover:h-3 sm:group-hover:w-4 sm:group-hover:h-4"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-3 group-hover:h-3 sm:group-hover:w-4 sm:group-hover:h-4"></div>

                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-orange-400/50">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    <button
                      onClick={() => handleJoinTeamRequest(teamId)}
                      disabled={joinLoading || hasRequested}
                      className="relative z-10 w-full px-4 sm:px-8 py-2 sm:py-2.5 font-bold text-sm sm:text-base md:text-lg uppercase text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                    >
                      {joinLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span className="text-xs sm:text-base">Sending...</span>
                        </>
                      ) : hasRequested ? (
                        <>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-base">Request Sent</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-base">Join Team</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {hasRequested && (
                <p className="text-center text-gray-400 text-xs sm:text-sm mt-3">
                  Your request is pending approval from the team owner
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-2 rounded transition-all duration-300 font-bold uppercase text-xs sm:text-sm ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 p-6 rounded-lg text-center">
                <Users className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                <div className="text-3xl font-bold">{teamStats?.total_members || 0}</div>
                <div className="text-sm text-gray-400">Total Members</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg text-center">
                <Target className="w-12 h-12 mx-auto mb-2 text-green-400" />
                <div className="text-3xl font-bold">{teamStats?.win_rate || 0}%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg text-center">
                <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-400" />
                <div className="text-3xl font-bold">{teamStats?.wins || 0}</div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg text-center">
                <X className="w-12 h-12 mx-auto mb-2 text-red-400" />
                <div className="text-3xl font-bold">{teamStats?.losses || 0}</div>
                <div className="text-sm text-gray-400">Losses</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <Star className="w-12 h-12 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">Team Tier</div>
                    <div className="text-2xl font-bold">{teamStats?.tier || 'Amateur'}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <Medal className="w-12 h-12 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-400">Division</div>
                    <div className="text-2xl font-bold">{teamStats?.division || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700/50 transition-all">
                  <img
                    src={member.avatar ? `${API_URL}${member.avatar}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
                    alt={member.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold">{member.username}</div>
                    <div className="text-sm text-gray-400">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
            {filteredMembers.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users2 size={48} className="mx-auto mb-4" />
                <p>No members found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && isOwner && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <div key={request.id} className="bg-gray-800/50 p-5 rounded-lg">
                  <div className="flex flex-col items-center text-center gap-3 mb-4">
                    <img
                      src={request.avatar ? `${API_URL}${request.avatar}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
                      alt={request.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{request.name}</h3>
                      <span className="text-sm text-gray-400">{request.rank || 'Unranked'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestAction(request.id, 'reject')}
                      disabled={actionLoading}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded transition-all disabled:opacity-50"
                    >
                      <X className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleRequestAction(request.id, 'accept')}
                      disabled={actionLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-all disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {requests.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users2 size={48} className="mx-auto mb-4" />
                <p>No requests found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && isOwner && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Team Name</label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Team Tier</label>
                  <select
                    value={settingsForm.tier}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, tier: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="amateur">Amateur</option>
                    <option value="semi-pro">Semi-Pro</option>
                    <option value="professional">Professional</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Division</label>
                  <select
                    value={settingsForm.division}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, division: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <img src={logoPreview} alt="Logo preview" className="w-20 h-20 rounded-lg object-cover" />
                  )}
                  <label className="cursor-pointer bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded transition-all flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Banner</label>
                <div className="flex flex-col gap-4">
                  {bannerPreview && (
                    <img src={bannerPreview} alt="Banner preview" className="w-full h-32 rounded-lg object-cover" />
                  )}
                  <label className="cursor-pointer bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded transition-all flex items-center gap-2 w-fit">
                    <Upload className="w-5 h-5" />
                    <span>Upload Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded transition-all flex items-center gap-2"
                >
                  <Trash className="w-5 h-5" />
                  <span>Delete Team</span>
                </button>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {settingsLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-red-500/30 rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-500/20 rounded-xl border-2 border-red-500/30">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Delete Team</h3>
                <p className="text-gray-400 mt-1 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded mb-6">
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete{' '}
                <span className="font-bold text-white">{teamStats?.name}</span>? All team data, including members and history, will be permanently removed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full sm:w-auto bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 px-6 py-3 rounded transition-all text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteTeam();
                  setShowDeleteConfirm(false);
                }}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition-all flex items-center justify-center gap-2"
              >
                <Trash className="w-5 h-5" />
                <span>Delete Team</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetailPage;