"use client";
import { useState, useEffect } from 'react';
import { X, Users, Trophy, Star, Target, Medal, Search, Check, Loader2, UserPlus, Users2, MessageCircle, Image, Trash, AlertTriangle, Settings, Upload, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/app/components/toast/ToastProviderContext';


const ClubDetailPage = ({ onClose, onTeamUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const { id } = useParams();
  const { addToast } = useToast();
  const [isMember, setIsMember] = useState(false);

  const [userId, setUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost';
  const router = useRouter();
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
const [teamSettings, setTeamSettings] = useState(null);
const [settingsLoading, setSettingsLoading] = useState(false);
const [logoPreview, setLogoPreview] = useState(null);
const [bannerPreview, setBannerPreview] = useState(null);
  // Tabs - conditionally include 'requests' only for owners
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    ...(isOwner ? [{ id: 'requests', label: 'Requests' }] : []),
     ...(isOwner ? [{ id: 'settings', label: 'Settings' }] : []),
  ];

  // Default avatar SVG
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
      tier: teamStats.tier || '',
      division: teamStats.division || '',
      logo: null,
      banner: null
    });
    setLogoPreview(teamStats.logo ? `${API_URL}/${teamStats.logo}` : null);
    setBannerPreview(teamStats.banner ? `${API_URL}/${teamStats.banner}` : null);
  }
}, [teamStats]);
// Handler for logo upload
const handleLogoUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('team_id', team.id);
    formData.append('logo', file);

    fetch(`${API_URL}/api/team_api.php?endpoint=team-settings`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          addToast({
            type: 'success',
            message: 'Logo updated successfully',
            duration: 3000,
            position: 'bottom-right',
          });
          fetchTeamData();
        } else {
          throw new Error(data.message || 'Failed to update logo');
        }
      })
      .catch((error) => {
        addToast({
          type: 'error',
          message: error.message,
          duration: 5000,
          position: 'bottom-right',
        });
      });
  }
};
// Handler for banner upload
const handleBannerUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('team_id', team.id);
    formData.append('banner', file);

    fetch(`${API_URL}/api/team_api.php?endpoint=team-settings`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          addToast({
            type: 'success',
            message: 'Banner updated successfully',
            duration: 3000,
            position: 'bottom-right',
          });
          fetchTeamData();
        } else {
          throw new Error(data.message || 'Failed to update banner');
        }
      })
      .catch((error) => {
        addToast({
          type: 'error',
          message: error.message,
          duration: 5000,
          position: 'bottom-right',
        });
      });
  }
};

const handleFileChange = (e, type) => {
  const file = e.target.files[0];
  if (file) {
    setSettingsForm(prev => ({ ...prev, [type]: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogoPreview(reader.result);
      } else {
        setBannerPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }
};
// Handler for settings form submission
const handleSettingsSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_id: teamStats?.id,
        name: settingsForm.name,
        tag: settingsForm.tag,
        description: settingsForm.description,
        game_id: settingsForm.game_id,
        division: settingsForm.division,
        tier: settingsForm.tier,
        contact_email: settingsForm.contact_email,
        discord: settingsForm.discord,
        twitter: settingsForm.twitter,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }

    const result = await response.json();

    if (result.success) {
      addToast({
        type: 'success',
        message: 'Team settings updated successfully',
        duration: 5000,
        position: 'bottom-right',
      });
      await fetchTeamData();
      if (onTeamUpdate) {
        onTeamUpdate();
      }
    } else {
      throw new Error(result.message || 'Failed to update settings');
    }
  } catch (err) {
    setError('Failed to update settings. Please try again.');
    addToast({
      type: 'error',
      message: err.message,
      duration: 5000,
      position: 'bottom-right',
    });
  }
};
// Handler for deleting team
const handleDeleteTeam = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/team_api.php?endpoint=team-settings&team_id=${team.id}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete team');
    }

    const result = await response.json();

    if (result.success) {
      addToast({
        type: 'success',
        message: 'Team deleted successfully',
        duration: 5000,
        position: 'bottom-right',
      });
      onClose();
      if (onTeamUpdate) {
        onTeamUpdate();
      }
    } else {
      throw new Error(result.message || 'Failed to delete team');
    }
  } catch (err) {
    setError('Failed to delete team. Please try again.');
    addToast({
      type: 'error',
      message: err.message,
      duration: 5000,
      position: 'bottom-right',
    });
  }
};
// useEffect to populate form with team data
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
    }
  }, [teamStats]);
  // First useEffect: Get userId from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('authData');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          console.log("Setting userId to:", parsed.userId);
          setUserId(parsed.userId);
        } catch (error) {
          console.error("Error parsing authData:", error);
          setError('Failed to load user data from storage');
        }
      } else {
        console.log("No authData found in localStorage");
        setError('No authentication data found. Please log in again.');
        setLoading(false);
      }
    }
  }, []);

  // Second useEffect: Fetch team data when BOTH id AND userId are ready
  useEffect(() => {
    if (id && userId) {
      console.log("Fetching data - Team ID:", id, "User ID:", userId);
      fetchTeamData();
    }
  }, [id, userId]);

  // Hide the main dashboard sidebar while this detail page is mounted
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('hide-dashboard-sidebar');
      // cleanup on unmount
      return () => {
        document.body.classList.remove('hide-dashboard-sidebar');
      };
    }
    return undefined;
  }, []);

  const fetchTeamData = async () => {
    if (!id) {
      console.log("No teamId available, skipping fetch");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchConfig = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      };

      console.log("Fetching team data for teamId:", id);

      const [statsRes, membersRes, requestsRes] = await Promise.all([
        fetch(`${API_URL}/api/team_api.php?endpoint=team-stats&team_id=${id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-members&team_id=${id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-requests&team_id=${id}`, fetchConfig),
      ]);

      const [statsData, membersData, requestsData] = await Promise.all([
        statsRes.json(),
        membersRes.json(),
        requestsRes.json(),
      ]);

      console.log("Stats data:", statsData);
      console.log("Members data:", membersData);
      console.log("Requests data:", requestsData);

      if (!statsRes.ok || !membersRes.ok || !requestsRes.ok) {
        throw new Error('Failed to fetch team data');
      }

      if (membersData.data.members && userId) {
        const userIsMember = membersData.data.members.some(member => 
          String(member.user_id) === String(userId)
        );
        setIsMember(userIsMember);
      }

        setTeamStats(statsData.data);
      setMembers(membersData.data.members || []);
      setRequests(requestsData.data || []);
      console.log('-------------------------------------------')
      console.log("Checking ownership: Owner ID:", statsData.data.owner_id, "User ID:", userId);
        // Add this to the response handling: populate settings form with team data
        setSettingsForm((prev) => ({
          ...prev,
          ...statsData.data,
        }));
      if (statsData.data && userId) {
        const ownerCheck = String(statsData.data.owner_id) === String(userId);
        setIsOwner(ownerCheck);
        console.log("Is user owner?", ownerCheck, "Owner ID:", statsData.data.owner_id, "User ID:", userId);
      }

      if (requestsData.data && userId) {
        const userRequest = requestsData.data.find(req => req.user_id === userId);
        setHasRequested(!!userRequest);
        console.log("Has user requested to join?", !!userRequest);
      }
    } catch (err) {
      setError('Failed to load team data. Please try again.');
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(true);
    try {
      const apiAction = action === 'accept' ? 'accepted' : 'rejected';

      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: id,
          request_id: requestId,
          action: apiAction,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} the request`);
      }

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          message: `Request ${action}ed successfully`,
          duration: 5000,
          position: 'bottom-right',
        });
        fetchTeamData();
      } else {
        throw new Error(data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinTeamRequest = async () => {
    setJoinLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=join-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: id, user_id: userId, role: 'Mid', rank: 'Unranked' }),
        mode: 'cors',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send join request');
      }

      addToast({ type: 'success', message: 'Join request sent successfully!', duration: 5000, position: 'bottom-right' });
      setHasRequested(true);
    } catch (error) {
      console.error('Error sending join request:', error);
      addToast({ type: 'error', message: `Error: ${error.message}`, duration: 5000, position: 'bottom-right' });
    } finally {
      setJoinLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-dark flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchTeamData}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-dark font-bold rounded transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" text-white min-h-screen bg-dark relative overflow-hidden  ">
      {/* Background Image Section */}
      <div className="absolute top-0 left-0 right-0 h-screen z-0">
        <div className="relative w-full h-full">
          <img
            src={teamStats?.banner ? `${API_URL}/${teamStats.banner}` : 'https://framerusercontent.com/images/t7ZowO33lGwkXjvFtZPiTbxFwc.jpg?scale-down-to=1024'}
            alt="Team Background"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark to-dark"></div>
          
          {/* Left side fade overlay */}
          <div className="absolute top-0 left-0 bottom-0 w-32 sm:w-48 md:w-64 lg:w-80 bg-gradient-to-r from-dark via-dark/80 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
      
      {/* Close button */}
      <button 
        onClick={()=>router.back()}
        className="fixed top-20 sm:top-24 right-4 sm:right-6 z-[99999999999999] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-dark/50 border border-white/20 hover:border-orange-500/50 transition-all duration-300 group"
      >
        <X className="text-white/70 group-hover:text-orange-500 transition-colors" size={20} />
      </button>

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          {/* Club Logo */}
          <div className="relative mb-4 sm:mb-6 group">
            <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-primary transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
            <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-primary transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
            <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-primary transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
            <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-primary transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
            
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
            
            <div 
              className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 overflow-hidden transition-all duration-300 group-hover:scale-105"
              style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)' }}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary/80 border-2 sm:border-4 border-primary/50 flex items-center justify-center">
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl special-font mb-2 tracking-tight text-center px-4">
            {teamStats?.name || 'Team Name'}
          </h1>

          {/* Organizer */}
          {/* <div className="flex items-center gap-2 text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
            <span>Organisé(e) par</span>
            <span className="text-primary font-semibold">{teamStats}</span>
          </div> */}

          {/* Member Count Badge */}
          <div className="flex items-center gap-2 bg-dark/50 backdrop-blur-sm px-4 sm:px-6 py-2 rounded border border-white/10">
            <Users size={16} className="text-gray-400 sm:w-5 sm:h-5" />
            <span className="text-xl sm:text-2xl special-font">{teamStats?.total_members || 0}</span>
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
                      onClick={()=>handleJoinTeamRequest(teamId)}
                      disabled={joinLoading || hasRequested}
                      className="relative z-10 w-full px-4 sm:px-8 py-2 sm:py-2.5 font-bold text-sm sm:text-base md:text-lg uppercase text-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
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
            <div key={tab.id} className="relative inline-block px-1 group">
              <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
                activeTab === tab.id ? 'border-orange-500' : 'border-transparent group-hover:border-white/30'
              }`}></div>
              <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
                activeTab === tab.id ? 'border-orange-500' : 'border-transparent group-hover:border-white/30'
              }`}></div>

              <div 
                className={`relative overflow-hidden transition-all duration-300 ${
                  activeTab === tab.id ? 'scale-105' : 'group-hover:scale-102'
                }`}
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
              >
                <div className={`relative px-3 sm:px-6 py-1.5 sm:py-2 border transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-orange-500 border-orange-500/50' 
                    : 'bg-dark/40 border-white/10 group-hover:border-white/30 group-hover:bg-dark/60'
                }`}>
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
                  
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-300 ${
                    activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`}></div>
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-300 ${
                    activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`}></div>

                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                  >
                    <span className={`tracking-widest uppercase text-xs sm:text-sm font-bold transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'text-dark' 
                        : 'text-white/50 group-hover:text-white/80'
                    }`}>
                      {tab.label}
                    </span>
                  </button>
                </div>
              </div>

              {activeTab === tab.id && (
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3/4 h-2 bg-orange-500/30 blur-md"
                  style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Members */}
              <div className="relative inline-block px-1 group">
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-purple-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-purple-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                
                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-gradient-to-br from-purple-900/40 to-purple-950/40 border border-purple-700/30 p-4 sm:p-6 md:p-8 text-center">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] opacity-50"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-4 rounded-full bg-purple-800/30 flex items-center justify-center border border-purple-600/30">
                        <Users className="text-purple-400" size={20} />
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-white">{teamStats?.total_members || 0}</div>
                      <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-gray-400 font-bold">Total Members</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Win Rate */}
              <div className="relative inline-block px-1 group">
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-green-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-green-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                
                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-gradient-to-br from-green-900/40 to-green-950/40 border border-green-700/30 p-4 sm:p-6 md:p-8 text-center">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] opacity-50"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-4 rounded-full bg-green-800/30 flex items-center justify-center border border-green-600/30">
                        <Target className="text-green-400" size={20} />
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-white">{teamStats?.win_rate || 0}%</div>
                      <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-gray-400 font-bold">Win Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wins */}
              <div className="relative inline-block px-1 group">
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-yellow-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-yellow-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                
                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 border border-yellow-700/30 p-4 sm:p-6 md:p-8 text-center">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] opacity-50"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-4 rounded-full bg-yellow-800/30 flex items-center justify-center border border-yellow-600/30">
                        <Trophy className="text-yellow-400" size={20} />
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-white">{teamStats?.wins || 0}</div>
                      <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-gray-400 font-bold">Wins</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Losses */}
              <div className="relative inline-block px-1 group">
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-red-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-red-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                
                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-gradient-to-br from-red-900/40 to-red-950/40 border border-red-700/30 p-4 sm:p-6 md:p-8 text-center">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] opacity-50"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-4 rounded-full bg-red-800/30 flex items-center justify-center border border-red-600/30">
                        <X className="text-red-400" size={20} />
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-white">{teamStats?.losses || 0}</div>
                      <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-gray-400 font-bold">Losses</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Tier and Division */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Team Tier */}
              <div className="relative inline-block px-1 group">
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-purple-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-purple-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                
                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-dark/40 border border-purple-700/30 p-4 sm:p-6">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-purple-900/50 flex items-center justify-center border-2 border-purple-700/50">
                        <Star className="text-purple-400" size={20} />
                      </div>
                      <div>
                        <div className="text-gray-400 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider font-bold mb-1">Team Tier</div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-white">{teamStats?.tier || 'Amateur'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Division */}
              <div className="relative inline-block px-1 group">
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-yellow-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-yellow-500 transition-all duration-300 group-hover:w-3 group-hover:h-3"></div>
                
                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <div className="relative bg-dark/40 border border-yellow-700/30 p-4 sm:p-6">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                    
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-yellow-900/50 flex items-center justify-center border-2 border-yellow-700/50">
                        <Medal className="text-yellow-400" size={20} />
                      </div>
                      <div>
                        <div className="text-gray-400 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider font-bold mb-1">Division</div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-white">{teamStats?.division || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4 sm:space-y-6 mx-auto flex justify-center items-center flex-col">
            {/* Search bar with futuristic styling */}
            <div className="relative inline-block px-1 w-full max-w-2xl fgroup">
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-transparent group-focus-within:border-orange-500 transition-all duration-300"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-transparent group-focus-within:border-orange-500 transition-all duration-300"></div>

              <div 
                className="relative overflow-hidden transition-all duration-300 group-focus-within:scale-[1.02]"
              >
                <div className="relative border transition-all duration-300 bg-dark/40  border-orange-500/50 ">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50 pointer-events-none"></div>
                  
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>

                  <Search
                    className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300 z-10"
                    size={18}
                  />

                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="relative z-10 w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 bg-transparent text-sm sm:text-base text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Members list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="relative inline-block px-1 group">
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-transparent group-hover:border-orange-500 transition-all duration-300"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-transparent group-hover:border-orange-500 transition-all duration-300"></div>

                  <div 
                    className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                  >
                    <div className="relative bg-dark/40 border border-gray-800 group-hover:border-orange-500/50 p-3 sm:p-4 transition-all duration-300">
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
                      
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <img
                            src={member.avatar ? `${API_URL}${member.avatar}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
                            alt={member.username}
                            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-700 group-hover:border-orange-500/50 transition-all duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide truncate group-hover:text-orange-400 transition-colors duration-300">
                            {member.username}
                          </div>
                          <div className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mt-0.5 sm:mt-1">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center font-zentry py-8 sm:py-12 text-gray-400 text-2xl sm:text-2xl">
           <div className="text-center text-gray-400 mt-8">
          <Users2 size={48} className="mx-auto mb-4" />
          <p>     No members found</p>
        </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && isOwner && (
          <div className="space-y-4 sm:space-y-6">
            {/* <div className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-dark/30 p-4 sm:p-6 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 sm:gap-3">
                  <UserPlus className="text-orange-500" size={24} />
                  <div>
                    <div className="text-gray-400 text-xs sm:text-sm">Pending Requests</div>
                    <div className="text-2xl sm:text-3xl font-bold">{requests.length}</div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Requests list */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 py-6">
  {requests.map((request) => (
    <div 
      key={request.id} 
      className="relative group"
    >
      {/* Animated corner brackets */}
      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500/0 group-hover:border-orange-500 transition-all duration-500 ease-out"></div>
      <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500/0 group-hover:border-orange-500 transition-all duration-500 ease-out delay-75"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500/0 group-hover:border-orange-500 transition-all duration-500 ease-out delay-150"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500/0 group-hover:border-orange-500 transition-all duration-500 ease-out delay-75"></div>

      {/* Main card with angled corners */}
      <div 
        className="relative overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/20 h-full"
        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
      >
        {/* Background with gradient */}
        <div className="relative bg-gradient-to-br from-dark via-dark to-gray-800 border border-gray-800 group-hover:border-orange-500/50 p-5 sm:p-6 transition-all duration-300 h-full flex flex-col">
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
          </div>
          
          {/* Animated top/bottom borders */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-4 h-full">
            
            {/* User info section */}
            <div className="flex flex-col items-center text-center gap-3">
              {/* Avatar with glow effect */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={request.avatar ? `${API_URL}${request.avatar}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
                  alt={request.name}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-700 group-hover:border-orange-500 group-hover:scale-110 transition-all duration-300"
                />
                {/* Online indicator dot */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 group-hover:scale-125 transition-transform duration-300"></div>
              </div>

              {/* Name and rank */}
              <div className="w-full">
                <h3 className="text-white font-bold text-base sm:text-lg uppercase tracking-wide group-hover:text-orange-400 transition-colors duration-300 truncate">
                  {request.name}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                  <span className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                    {request.rank || 'Unranked'}
                  </span>
                  <div className="h-px w-8 bg-gradient-to-r from-orange-500 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3 mt-auto">
              
              {/* Decline Button */}
              <button
                onClick={() => handleRequestAction(request.id, 'reject')}
                disabled={actionLoading}
                className="relative flex-1 group/btn overflow-hidden"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                <div className="relative bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 px-4 py-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  
                  {/* Button background pattern */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] opacity-50"></div>
                  
                  {/* Hover sweep effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                    )}
                    <span className="font-bold uppercase tracking-wider text-xs text-red-400 group-hover/btn:text-red-300">
                      Decline
                    </span>
                  </div>
                </div>
              </button>

              {/* Accept Button */}
              <button
                onClick={() => handleRequestAction(request.id, 'accept')}
                disabled={actionLoading}
                className="relative flex-1 group/btn overflow-hidden"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 border border-green-400/50 hover:border-green-300 px-4 py-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20 hover:shadow-green-500/40">
                  
                  {/* Button background pattern */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] opacity-50"></div>
                  
                  {/* Hover sweep effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 group-hover/btn:scale-125 transition-transform duration-300" />
                    )}
                    <span className="font-bold uppercase tracking-wider text-xs text-white">
                      Accept
                    </span>
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
            {requests.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-gray-400 text-sm sm:text-base">
            <div className="text-center text-gray-400 mt-8">
          <Users2 size={48} className="mx-auto mb-4" />
          <p>      No requests found</p>
        </div>
               
              </div>
            )}
          </div>
        )}
  
{activeTab === 'settings' && isOwner && (
  <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
    <form onSubmit={handleSettingsSubmit} className="space-y-6">
      
      {/* Team Name */}
      <div className="relative inline-block px-1 w-full group">
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-orange-500/30 group-focus-within:border-orange-500 transition-all duration-300"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-orange-500/30 group-focus-within:border-orange-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-orange-500/30 group-focus-within:border-orange-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-orange-500/30 group-focus-within:border-orange-500 transition-all duration-300"></div>

        <div 
          className="relative overflow-hidden transition-all duration-300"
          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        >
          <div className="relative bg-dark/40 border border-gray-800 group-focus-within:border-orange-500/50 p-5 sm:p-6 transition-all duration-300">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            
            <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
              Team Name
            </label>
            <input
              type="text"
              value={settingsForm.name}
              onChange={(e) => setSettingsForm(prev => ({ ...prev, name: e.target.value }))}
              className="relative z-10 w-full bg-dark/50 font-circular-web border border-gray-700  px-4 py-3 text-white rounded-sm focus:outline-none transition-all duration-300"
              placeholder="Enter team name"
            />
          </div>
        </div>
      </div>

      {/* Team Tag */}
      <div className="relative inline-block px-1 w-full group">
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-blue-500/30 group-focus-within:border-blue-500 transition-all duration-300"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-blue-500/30 group-focus-within:border-blue-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-blue-500/30 group-focus-within:border-blue-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-blue-500/30 group-focus-within:border-blue-500 transition-all duration-300"></div>

        <div 
          className="relative overflow-hidden transition-all duration-300"
          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        >
          <div className="relative bg-dark/40 border border-gray-800 group-focus-within:border-blue-500/50 p-5 sm:p-6 transition-all duration-300">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            
            <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
              Team Tag
            </label>
            <input
              type="text"
              value={settingsForm.tag}
              onChange={(e) => setSettingsForm(prev => ({ ...prev, tag: e.target.value }))}
              maxLength={10}
              className="relative z-10 w-full bg-dark/50 font-circular-web border border-gray-700  px-4 py-3 text-white rounded-sm focus:outline-none transition-all duration-300"
              placeholder="Enter team tag (max 10 chars)"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="relative inline-block px-1 w-full group">
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-purple-500/30 group-focus-within:border-purple-500 transition-all duration-300"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-purple-500/30 group-focus-within:border-purple-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-purple-500/30 group-focus-within:border-purple-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-purple-500/30 group-focus-within:border-purple-500 transition-all duration-300"></div>

        <div 
          className="relative overflow-hidden transition-all duration-300"
          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        >
          <div className="relative bg-dark/40 border border-gray-800 group-focus-within:border-purple-500/50 p-5 sm:p-6 transition-all duration-300">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            
            <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
              Team Description
            </label>
            <textarea
              value={settingsForm.description}
              onChange={(e) => setSettingsForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="relative z-10 w-full bg-dark/50 font-circular-web border border-gray-700 focus:border-purple-500 px-4 py-3 text-white rounded-sm focus:outline-none transition-all duration-300 resize-none"
              placeholder="Tell others about your team..."
            />
          </div>
        </div>
      </div>

      {/* Tier and Division Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Team Tier */}
        <div className="relative inline-block px-1 w-full group">
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-yellow-500/30 group-focus-within:border-yellow-500 transition-all duration-300"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-yellow-500/30 group-focus-within:border-yellow-500 transition-all duration-300"></div>

          <div 
            className="relative overflow-hidden transition-all duration-300"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            <div className="relative bg-dark/40 border border-gray-800 group-focus-within:border-yellow-500/50 p-5 sm:p-6 transition-all duration-300">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
              
              <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
                Team Tier
              </label>
              <select
                value={settingsForm.tier}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, tier: e.target.value }))}
                className="relative z-10 w-full bg-dark/50 font-circular-web border border-gray-700 focus:border-yellow-500 px-4 py-3 text-white rounded-sm focus:outline-none transition-all duration-300"
              >
                <option value="">Select Tier</option>
                <option value="amateur">Amateur</option>
                <option value="semi-pro">Semi-Pro</option>
                <option value="professional">Professional</option>
                <option value="elite">Elite</option>
              </select>
            </div>
          </div>
        </div>

        {/* Division */}
        <div className="relative inline-block px-1 w-full group">
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-green-500/30 group-focus-within:border-green-500 transition-all duration-300"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-green-500/30 group-focus-within:border-green-500 transition-all duration-300"></div>

          <div 
            className="relative overflow-hidden transition-all duration-300"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            <div className="relative bg-dark/40 border border-gray-800 group-focus-within:border-green-500/50 p-5 sm:p-6 transition-all duration-300">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
              
              <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
                Division
              </label>
              <select
                value={settingsForm.division}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, division: e.target.value }))}
                className="relative z-10 w-full bg-dark/50 font-circular-web  border border-gray-700 focus:border-green-500 px-4 py-3 text-white rounded-sm focus:outline-none transition-all duration-300"
              >
                <option value="">Select Division</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Social Media Section */}
      <div className="space-y-4">
        <h4 className="text-2xl special-font text-primary uppercase tracking-wider flex items-center">
          <MessageCircle size={20} className="mr-2" />
          Social Media
        </h4>

        {/* Contact Email */}
        <div className="relative inline-block px-1 w-full group">
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-indigo-500/30 group-focus-within:border-indigo-500 transition-all duration-300"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-indigo-500/30 group-focus-within:border-indigo-500 transition-all duration-300"></div>

          <div 
            className="relative overflow-hidden transition-all duration-300"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            <div className="relative bg-dark/40 border border-gray-800 group-focus-within:border-indigo-500/50 p-5 sm:p-6 transition-all duration-300">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
              
              <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
                Contact Email
              </label>
              <input
                type="email"
                value={settingsForm.contact_email}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, contact_email: e.target.value }))}
                className="relative z-10 w-full bg-dark/50 font-circular-web border-gray-700 focus:border-indigo-500 px-4 py-3 text-white rounded-sm focus:outline-none transition-all duration-300"
                placeholder="team@example.com"
              />
            </div>
          </div>
        </div>

        {/* Discord and Twitter Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Discord */}
          <div className="relative inline-block px-1 w-full group">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-indigo-400/30 group-focus-within:border-indigo-400 transition-all duration-300"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-indigo-400/30 group-focus-within:border-indigo-400 transition-all duration-300"></div>

            <div 
              className="relative overflow-hidden transition-all duration-300"
              style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
            >
              <div className="relative bg-dark/40 border border-gray-800 group-focus-within:border-indigo-400/50 p-5 sm:p-6 transition-all duration-300">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
                
                <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
                  Discord
                </label>
                <input
                  type="text"
                  value={settingsForm.discord}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, discord: e.target.value }))}
                  className="relative z-10 w-full bg-dark/50 font-circular-web border border-gray-700 focus:border-indigo-400 px-4 py-3 text-white rounded-sm focus:outline-none transition-all duration-300"
                  placeholder="discord.gg/invite"
                />
              </div>
            </div>
          </div>

          {/* Twitter */}
          <div className="relative inline-block px-1 w-full group">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-blue-400/30 group-focus-within:border-blue-400 transition-all duration-300"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-blue-400/30 group-focus-within:border-blue-400 transition-all duration-300"></div>

            <div 
              className="relative overflow-hidden transition-all duration-300"
              style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
            >
              <div className="relative bg-dark/40 border border-gray-800 group-focus-within:border-blue-400/50 p-5 sm:p-6 transition-all duration-300">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
                
                <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
                  Twitter/X
                </label>
                <input
                  type="text"
                  value={settingsForm.twitter}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, twitter: e.target.value }))}
                  className="relative z-10 w-full bg-dark/50 font-circular-web border border-gray-700 focus:border-blue-400 px-4 py-3 text-white rounded-sm focus:outline-none transition-all duration-300"
                  placeholder="@username"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="relative inline-block px-1 w-full group">
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-500 transition-all duration-300"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-500 transition-all duration-300"></div>

        <div 
          className="relative overflow-hidden transition-all duration-300"
          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        >
          <div className="relative bg-dark/40 border border-gray-800 group-hover:border-cyan-500/50 p-5 sm:p-6 transition-all duration-300">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
            
            <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
              Team Logo
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
              {teamStats?.logo && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-cyan-500/50">
                  <img src={`${API_URL}/${teamStats.logo}`} alt="Logo preview" className="w-full h-full object-cover" />
                </div>
              )}
              
              <label className="relative cursor-pointer group/upload">
                <div 
                  className="relative overflow-hidden"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                >
                  <div className="relative bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500 px-6 py-3 transition-all duration-300">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"></div>
                    <div className="relative z-10 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-cyan-400" />
                      <span className="font-circular-web uppercase tracking-wider text-sm text-cyan-400">
                        Upload Logo
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Upload */}
      <div className="relative inline-block px-1 w-full group">
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-pink-500/30 group-hover:border-pink-500 transition-all duration-300"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-pink-500/30 group-hover:border-pink-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-pink-500/30 group-hover:border-pink-500 transition-all duration-300"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-pink-500/30 group-hover:border-pink-500 transition-all duration-300"></div>

        <div 
          className="relative overflow-hidden transition-all duration-300"
          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        >
          <div className="relative bg-dark/40 border border-gray-800 group-hover:border-pink-500/50 p-5 sm:p-6 transition-all duration-300">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
            
            <label className="block text-gray-400 text-lg font-zentry uppercase tracking-wider font-bold mb-3 relative z-10">
              Team Banner
            </label>
            
            <div className="flex flex-col gap-4 relative z-10">
              {teamStats?.banner && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-pink-500/50">
                  <img src={`${API_URL}/${teamStats.banner}`} alt="Banner preview" className="w-full h-full object-cover" />
                </div>
              )}
              
              <label className="relative cursor-pointer group/upload w-fit">
                <div 
                  className="relative overflow-hidden"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                >
                  <div className="relative bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-500 px-6 py-3 transition-all duration-300">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"></div>
                    <div className="relative z-10 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-pink-400" />
                      <span className="font-circular-web uppercase tracking-wider text-sm text-pink-400">
                        Upload Banner
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        {/* Delete Button */}
        <div className="relative inline-block px-1 group">
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>

          <div 
            className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="relative bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500 px-6 py-3 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <div className="relative z-10 flex items-center gap-3">
                <Trash className="w-5 h-5 text-red-400" />
                <span className="font-zentry uppercase tracking-wider text-red-400">Delete Team</span>
              </div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="relative inline-block px-1 group">
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>

          <div 
            className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            <button
              type="submit"
              disabled={settingsLoading}
              className="relative bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 border-2 border-orange-400/50 hover:border-orange-300 px-8 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <div className="relative z-10 flex items-center gap-3">
                {settingsLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span className="font-bold uppercase tracking-wider text-white">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 text-white" />
                    <span className="font-zentry text-md uppercase tracking-wider text-white">Save Changes</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

    </form>
  </div>
)}

{/* Delete Confirmation Modal */}
{showDeleteConfirm && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[99999999999999999999] flex items-center justify-center p-4 animate-fadeIn">
    <div className="relative inline-block px-1 group max-w-md w-full">
      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-red-500 transition-all duration-300"></div>
      <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-red-500 transition-all duration-300"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-red-500 transition-all duration-300"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-red-500 transition-all duration-300"></div>

      <div 
        className="relative overflow-hidden"
        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
      >
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-2 border-red-500/30 p-6 md:p-8">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_3px)]"></div>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-500/20 rounded-xl border-2 border-red-500/30">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Delete Team</h3>
                <p className="text-gray-400 mt-1 text-sm">This action cannot be undone</p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-red-500/5 blur-xl"></div>
              <div 
                className="relative overflow-hidden"
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
              >
                <div className="relative bg-red-500/10 border border-red-500/30 p-4">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)]"></div>
                  <p className="relative z-10 text-gray-300 text-sm">
                    Are you sure you want to delete{' '}
                    <span className="font-bold text-white">{team?.name}</span>? All team data, including members and history, will be permanently removed.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              {/* Cancel Button */}
              <div className="relative inline-block px-1 group/cancel w-full sm:w-auto">
                <div 
                  className="relative overflow-hidden"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                >
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="relative w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 px-6 py-3 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)]"></div>
                    <span className="relative z-10 font-bold uppercase tracking-wider text-sm text-gray-400 group-hover/cancel:text-gray-300">
                      Cancel
                    </span>
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <div className="relative inline-block px-1 group/delete w-full sm:w-auto">
                <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-red-500 transition-all duration-300 group-hover/delete:w-3 group-hover/delete:h-3"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-red-500 transition-all duration-300 group-hover/delete:w-3 group-hover/delete:h-3"></div>

                <div 
                  className="relative overflow-hidden transition-all duration-300 group-hover/delete:scale-105"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                >
                  <button
                    onClick={() => {
                      handleDeleteTeam();
                      setShowDeleteConfirm(false);
                    }}
                    className="relative w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-red-400/50 hover:border-red-300 px-6 py-3 transition-all duration-300 shadow-lg shadow-red-500/20"
                  >
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/delete:translate-x-full transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <Trash className="w-5 h-5 text-white" />
                      <span className="font-bold uppercase tracking-wider text-sm text-white">Delete Team</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ClubDetailPage;