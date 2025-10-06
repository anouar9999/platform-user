'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, UserCircle, UserCircle2, Users } from 'lucide-react';
import AddTeamCard from './AddTeamCard';
import TeamSidebar from './TeamSidebar';
import CreateTeamForm from './CreateTeamForm';
import { IconTournament } from '@tabler/icons-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import NonOwnerView from './NonOwnerView';
import TeamCard from './TeamCard';
import ScannableTitle from '../../components/ScannableTitle';

// Constants
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Custom Hooks
const useTeamsData = (userId) => {
  const [teamsData, setTeamsData] = useState({
    allTeams: [],
    myTeams: [],
    isLoading: true,
    error: null,
  });

  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/get_teams.php`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Better error handling
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        const allTeamsData = result.data || [];
        const userOwnedTeams = allTeamsData.filter(
          (team) =>
            parseInt(team.owner_id) === userId ||
            team.members?.some((member) => parseInt(member.user_id) === userId),
        );

        setTeamsData({
          allTeams: allTeamsData,
          myTeams: userOwnedTeams,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(result.message || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeamsData((prev) => ({
        ...prev,
        isLoading: false,
        error,
      }));
      return error;
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTeams();
    } else {
      setTeamsData({
        allTeams: [],
        myTeams: [],
        isLoading: false,
        error: null,
      });
    }
  }, [userId, fetchTeams]);

  return { ...teamsData, refreshTeams: fetchTeams };
};

const TeamHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('myTeams'); // 'myTeams' or 'allTeams'
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('details');
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const { addToast } = useToast();

  // Move localStorage to useEffect
  useEffect(() => {
    // Access localStorage only after component mounts (client-side)
    const localAuthData = localStorage.getItem('authData');

    const parsedData = JSON.parse(localAuthData);
    if (parsedData.userId) {
      setUserId(parsedData.userId);
    }
  }, []);

  const { allTeams, myTeams, isLoading, error, refreshTeams } = useTeamsData(userId);

  // Get the page title based on active tab
  const getPageTitle = () => {
    const titles = {
      myTeams: [
        'YOUR TEAM HEADQUARTERS',
        'COMMAND CENTER',
        'SQUAD CENTRAL',
        'YOUR GAMING ALLIANCE',
        'TEAM STRONGHOLD',
      ],
      allTeams: [
        'DISCOVER TEAMS',
        'GAMING LEGIONS',
        'TEAM UNIVERSE',
        'ALLIANCE FRONTIER',
        'SQUAD HORIZON',
      ],
    };

    // Get random index but make it somewhat persistent during a session
    const sessionSeed = new Date().getDate() % titles[activeTab].length;

    // Return a dynamic title based on the active tab
    return titles[activeTab][sessionSeed];
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedTeam(null);
  };

  const handleTeamUpdate = useCallback(() => {
    refreshTeams();
  }, [refreshTeams]);

  // Example of how to properly make the fetch request from your Next.js frontend

  const handleJoinTeamRequest = async (teamId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team_api.php?endpoint=join-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            team_id: teamId,
            user_id: userId, // Make sure this variable is defined
            role: 'Mid', // You can make this dynamic based on user selection
            rank: 'Unranked', // You can make this dynamic based on user's actual rank
          }),
          mode: 'cors', // Explicitly set CORS mode
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send join request');
      }

      const data = await response.json();

      if (data.success) {
        // Show success message
        addToast({
          type: 'success',
          message: 'Join request sent successfully!',
          duration: 5000,
          position: 'bottom-right',
        });
        // Update UI or state as needed
      } else {
        throw new Error(data.message || 'Failed to send join request');
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      // Show error message
      addToast({
        type: 'error',
        message: `Error: ${error.message}`,
        duration: 5000,
        position: 'bottom-right',
      });
    }
  };

  const isInMyTeams = useCallback(
    (team) => {
      return myTeams.some((myTeam) => myTeam.id === team.id);
    },
    [myTeams],
  );

  const isTeamOwner = useCallback(
    (team) => {
      return parseInt(team?.owner_id) === userId;
    },
    [userId],
  );

  const handleAddTeam = () => {
    if (!userId) {
      addToast({
        type: 'error',
        message: 'Please login to create a team',
        duration: 5000,
        position: 'bottom-right',
      });
      return;
    }
    setIsCreateTeamOpen(true);
  };

  // Filter teams based on search term
  const filteredTeams = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return {
      my: myTeams.filter((team) => team.name.toLowerCase().includes(searchTermLower)),
      all: allTeams.filter((team) => team.name.toLowerCase().includes(searchTermLower)),
    };
  }, [searchTerm, myTeams, allTeams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-t-2 border-b-2 border-primary/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading teams: {error.message}</p>
        <button
          onClick={refreshTeams}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-24 text-white">
       {/* Header Section */}
   
      <div className="mb-8">
        <div className="flex items-center justify-between  ">
             <ScannableTitle 
  primaryText= {activeTab === 'myTeams' ? 'Teams' : 'All Teams'}
  secondaryText="Find the right club for you!"
/>
        <div className="flex items-center gap-3">
  <div className="relative inline-block px-1 group">
    {/* Animated corner accents */}
    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>

    {/* Rotating border glow effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 blur-md animate-pulse"></div>
    </div>

    {/* Main button container with clip-path */}
    <div 
      className="relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-active:scale-95"
      style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
    >
      {/* Background layers */}
      <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-orange-400/50 transition-all duration-300 group-hover:border-orange-300">
        {/* Animated scanline effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] opacity-50"></div>
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        {/* Top accent line with animation */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>

        {/* Pulse effect on corners */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-white/60 group-hover:animate-ping"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-white/60 group-hover:animate-ping animation-delay-100"></div>

        {/* Button content */}
        <button
          onClick={handleAddTeam}
          className="relative z-10 w-full h-full flex items-center justify-center gap-2 px-6 py-3 transition-all duration-300"
        >
          {/* Plus icon with special styling */}
          <span className="text-2xl font-bold text-black group-hover:rotate-90 transition-transform duration-300 group-hover:scale-110">
            +
          </span>
          
          {/* Text with tracking */}
          <span className="hidden sm:inline font-bold text-sm uppercase tracking-widest text-black group-hover:tracking-[0.2em] transition-all duration-300">
            Create Team
          </span>
          <span className="sm:hidden font-bold text-sm uppercase tracking-widest text-black group-hover:tracking-[0.2em] transition-all duration-300">
            Create
          </span>

          {/* Arrow indicator */}
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1 text-black font-bold">
            →
          </span>
        </button>
      </div>
    </div>

    {/* Enhanced skewed bottom shadow effect */}
    <div 
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-4/5 h-3 bg-orange-500/40 blur-lg opacity-70 group-hover:opacity-100 group-hover:h-4 transition-all duration-300"
      style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0 100%)' }}
    ></div>

    {/* Side glow effects */}
    <div className="absolute top-1/2 -left-2 w-1 h-1/2 -translate-y-1/2 bg-orange-500/0 group-hover:bg-orange-500/50 blur-sm transition-all duration-300"></div>
    <div className="absolute top-1/2 -right-2 w-1 h-1/2 -translate-y-1/2 bg-orange-500/0 group-hover:bg-orange-500/50 blur-sm transition-all duration-300"></div>
  </div>
</div>
        </div>
        
        <p className="text-gray-400 text-sm sm:text-base max-w-3xl leading-relaxed mb-6 font-circular-web">
          Discover your community on GAMIUS! Team up with players who share your passion. Chat, 
          strategize, and queue together for victory. Take on exciting events, conquer the Team Rankings, 
          score epic prizes, and make every match more fun!
        </p>
      </div>
    
      <div className="w-full space-y-reverse mb-0">
        {/* Tabs Navigation */}
      {/* Tabs Navigation */}
<div className="flex justify-between gap-4 mb-6">

 <div className='tabs'>
   {/* MY TEAMS Tab */}
  <div className="relative inline-block px-1 group">
    {/* Corner accents */}
    <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
      activeTab === 'myTeams' ? 'border-orange-500' : 'border-transparent group-hover:border-white/30'
    }`}></div>
    <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
      activeTab === 'myTeams' ? 'border-orange-500' : 'border-transparent group-hover:border-white/30'
    }`}></div>

    {/* Main button container with clip-path */}
    <div 
      className={`relative overflow-hidden transition-all duration-300 ${
        activeTab === 'myTeams' ? 'scale-105' : 'group-hover:scale-102'
      }`}
      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
    >
      {/* Background */}
      <div className={`relative px-6 py-2 border transition-all duration-300 ${
        activeTab === 'myTeams' 
          ? 'bg-orange-500 border-orange-500/50' 
          : 'bg-black/40 border-white/10 group-hover:border-white/30 group-hover:bg-black/60'
      }`}>
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
        
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-300 ${
          activeTab === 'myTeams' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}></div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-300 ${
          activeTab === 'myTeams' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}></div>

        {/* Button */}
        <button
          onClick={() => setActiveTab('myTeams')}
          className="relative z-10 w-full h-full flex items-center justify-center gap-2"
        >
          <span className={`tracking-widest uppercase text-sm font-bold transition-all duration-300 ${
            activeTab === 'myTeams' 
              ? 'text-black' 
              : 'text-white/50 group-hover:text-white/80'
          }`}>
            MY TEAMS
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium transition-all duration-300 ${
            activeTab === 'myTeams'
              ? 'text-black/70'
              : 'text-white/40 group-hover:text-white/60'
          }`}>
            ({myTeams.length})
          </span>
        </button>
      </div>
    </div>

    {/* Skewed bottom shadow effect when active */}
    {activeTab === 'myTeams' && (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3/4 h-2 bg-orange-500/30 blur-md"
        style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
      ></div>
    )}
  </div>

  {/* ALL TEAMS Tab */}
  <div className="relative inline-block px-1 group">
    {/* Corner accents */}
    <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
      activeTab === 'allTeams' ? 'border-orange-500' : 'border-transparent group-hover:border-white/30'
    }`}></div>
    <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
      activeTab === 'allTeams' ? 'border-orange-500' : 'border-transparent group-hover:border-white/30'
    }`}></div>

    {/* Main button container with clip-path */}
    <div 
      className={`relative overflow-hidden transition-all duration-300 ${
        activeTab === 'allTeams' ? 'scale-105' : 'group-hover:scale-102'
      }`}
      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
    >
      {/* Background */}
      <div className={`relative px-6 py-2 border transition-all duration-300 ${
        activeTab === 'allTeams' 
          ? 'bg-orange-500 border-orange-500/50' 
          : 'bg-black/40 border-white/10 group-hover:border-white/30 group-hover:bg-black/60'
      }`}>
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
        
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-300 ${
          activeTab === 'allTeams' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}></div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-300 ${
          activeTab === 'allTeams' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}></div>

        {/* Button */}
        <button
          onClick={() => setActiveTab('allTeams')}
          className="relative z-10 w-full h-full flex items-center justify-center gap-2"
        >
          <span className={`tracking-widest uppercase text-sm font-bold transition-all duration-300 ${
            activeTab === 'allTeams' 
              ? 'text-black' 
              : 'text-white/50 group-hover:text-white/80'
          }`}>
            ALL TEAMS
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium transition-all duration-300 ${
            activeTab === 'allTeams'
              ? 'text-black/70'
              : 'text-white/40 group-hover:text-white/60'
          }`}>
            ({allTeams.length})
          </span>
        </button>
      </div>
    </div>

    {/* Skewed bottom shadow effect when active */}
    {activeTab === 'allTeams' && (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3/4 h-2 bg-orange-500/30 blur-md"
        style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
      ></div>
    )}
  </div>
 </div>
           <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

</div>
        {/* Content based on active tab */}
        <div className="pt-4 ">
          {activeTab === 'myTeams' && (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 px-20">
                {/* <AddTeamCard onClick={handleAddTeam} /> */}

                {filteredTeams.my.length === 0 && searchTerm ? (
                  <div className="col-span-full text-gray-400 py-8">
                    <p>No teams match your search.</p>
                  </div>
                ) : (
                  <>
                    {filteredTeams.my.map((team) => (
                      <TeamCard
                        key={team.id}
                        team={team}
                        onClick={handleTeamClick}
                        isInMyTeams={true}
                      />
                    ))}
                  </>
                )}
              </div>

              {filteredTeams.my.length === 0 && !searchTerm && (
                <div className="text-center py-8 text-gray-400">
                  <p>You havent joined any teams yet.</p>
                  <p className="mt-2">Create a team or join an existing one to get started.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'allTeams' && (
            <div>
              {filteredTeams.all.length === 0 ? (
                <div className="text-gray-400 py-8">
                  <p>No teams match your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 px-20">
                  {filteredTeams.all.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onClick={handleTeamClick}
                      isInMyTeams={isInMyTeams(team)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <CreateTeamForm
          isOpen={isCreateTeamOpen}
          onClose={() => setIsCreateTeamOpen(false)}
          onFinish={refreshTeams}
        />
        {selectedTeam && (
          <>
            {isTeamOwner(selectedTeam) ? (
              <TeamSidebar
                team={selectedTeam}
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                activeTab={activeSidebarTab}
                setActiveTab={setActiveSidebarTab}
                onTeamUpdate={handleTeamUpdate}
                currentUserId={userId}
                className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md lg:max-w-lg"
              />
            ) : (
              <NonOwnerView
                team={selectedTeam}
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                isOwner={false}
                onJoinRequest={() => handleJoinTeamRequest(selectedTeam.id)}
                className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md lg:max-w-lg"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// SearchBar Component
const SearchBar = ({ value, onChange }) => (
  <div className="relative inline-block px-1 group w-full max-w-2xl">
    {/* Corner accents */}
    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-transparent group-focus-within:border-orange-500 transition-all duration-300"></div>
    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-transparent group-focus-within:border-orange-500 transition-all duration-300"></div>

    {/* Main container with clip-path */}
    <div 
      className="relative overflow-hidden transition-all duration-300 group-focus-within:scale-[1.02]"
      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
    >
      {/* Background */}
      <div className="relative border transition-all duration-300 bg-black/40 border-white/10 group-focus-within:border-orange-500/50 group-focus-within:bg-black/60">
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50 pointer-events-none"></div>
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>

        {/* Search Icon */}
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300 z-10"
          size={20}
        />

        {/* Input */}
        <input
          type="text"
          placeholder="Search teams..."
          className="relative z-10 w-full px-4 py-3 pl-12 bg-transparent text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>

    {/* Skewed bottom shadow effect when focused */}
    <div 
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3/4 h-2 bg-orange-500/30 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
      style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
    ></div>
  </div>
);





export default TeamHub;
