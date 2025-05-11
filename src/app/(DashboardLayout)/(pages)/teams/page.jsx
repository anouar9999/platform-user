'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, UserCircle } from 'lucide-react';
import AddTeamCard from './AddTeamCard';
import TeamSidebar from './TeamSidebar';
import CreateTeamForm from './CreateTeamForm';
import { IconTournament } from '@tabler/icons-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import NonOwnerView from './NonOwnerView';

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
          'Content-Type': 'application/json'
        }
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
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(parseInt(id));
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/team_api.php?endpoint=join-request`, {
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
    });

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

  const isInMyTeams = useCallback((team) => {
    return myTeams.some((myTeam) => myTeam.id === team.id);
  }, [myTeams]);

  const isTeamOwner = useCallback((team) => {
    return parseInt(team?.owner_id) === userId;
  }, [userId]);

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
    <div className="min-h-screen p-8 text-white">
      <div className="my-8">
        <div className="flex items-center text-primary">
          <IconTournament />
          
          <p className="mx-2 text-lg font-bold font-mono uppercase">UNITE AND TRIUMPH</p>
          
        </div>
        <h1 className="text-4xl flex items-center font-custom tracking-wider">
        {getPageTitle()}
      </h1>
      </div>
      <div className="w-full space-y-reverse mb-0">
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-800">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'myTeams'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('myTeams')}
          >
            MY TEAMS
            <span className="ml-2 text-xs text-gray-500">({myTeams.length})</span>
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'allTeams'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('allTeams')}
          >
            ALL TEAMS
            <span className="ml-2 text-xs text-gray-500">({allTeams.length})</span>
          </button>
        </div>
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        {/* Content based on active tab */}
        <div className="pt-4">
          {activeTab === 'myTeams' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                <AddTeamCard onClick={handleAddTeam} />

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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
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
  <div className="relative">
    <input
      type="text"
      placeholder="Search teams..."
      className="w-full px-4 py-3 bg-dark text-white angular-cut pl-10 focus:outline-none"
      value={value}
      onChange={onChange}
    />
    <Search
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      size={20}
    />
  </div>
);

const TeamCard = ({ team, onClick, isInMyTeams }) => (
  <div
    className="rounded-sm shadow-md overflow-hidden cursor-pointer 
               transition-all duration-300 hover:-translate-y-1 h-full"
    onClick={() => onClick(team)}
  >
    <div className="relative aspect-video">
      {team.logo ? (
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`}
            alt={`${team.name} banner`}
          />
          {/* Image overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-30 transition-opacity duration-300"></div>

          {/* Add an indicator for teams in "My Teams" if needed */}
          
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700">
          {team.logo ? (
            <img 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain" 
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`}
              alt={`${team.name} logo`} 
            />
          ) : (
            <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-500" />
          )}
        </div>
      )}
      <div className="absolute bottom-1 left-1 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-2">
        <h5 className="text-lg sm:text-xl font-custom tracking-widest text-white truncate">
          {team.name}
        </h5>
        
      </div>
    </div>
  </div>
);

export default TeamHub;