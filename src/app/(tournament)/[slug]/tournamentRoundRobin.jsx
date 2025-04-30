import React, { useState, useEffect } from 'react';
import { TbTournament } from 'react-icons/tb';
import { FaTrophy, FaChartBar, FaUserFriends, FaInfoCircle, FaMedal, FaCalendarAlt, FaFilter, FaFire, FaSkull, FaEquals, FaSpinner } from 'react-icons/fa';
// import PlayoffsBracket from './components/brackets/PlayoffsBracket';
import axios from 'axios';

// API base URL - replace with your actual API base URL


const MultiGroupRoundRobinTournament = ({ tournamentId }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [activeTab, setActiveTab] = useState('groups');
  const [currentRound, setCurrentRound] = useState(0);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tournament data
  const [tournamentData, setTournamentData] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGroupIndex, setModalGroupIndex] = useState(null);

  // State for match results
  const [matchResults, setMatchResults] = useState([]);
  
  // State for playoffs
  const [playoffData, setPlayoffData] = useState(null);
  const [playoffLoading, setPlayoffLoading] = useState(false);

  // Fetch tournament data on component mount
  useEffect(() => {
    if (!tournamentId) {
      setError('Tournament ID is required');
      setLoading(false);
      return;
    }
    
    fetchTournamentGroups();
  }, [tournamentId]);

  // Function to fetch tournament groups and matches
  const fetchTournamentGroups = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_tournament_groups.php?tournament_id=${tournamentId}`);
      
      if (response.data.success) {
        setTournamentData(response.data.data.tournament);
        
        if (response.data.data.groups && response.data.data.groups.length > 0) {
          setGroups(response.data.data.groups);
          
          // Extract match results
          const results = [];
          response.data.data.groups.forEach(group => {
            Object.entries(group.matches).forEach(([roundIndex, roundMatches]) => {
              roundMatches.forEach((match, matchIndex) => {
                if (match.team1_score !== null && match.team2_score !== null) {
                  results.push({
                    groupId: group.id,
                    round: parseInt(roundIndex),
                    matchIndex: matchIndex,
                    team1Score: match.team1_score,
                    team2Score: match.team2_score
                  });
                }
              });
            });
          });
          
          setMatchResults(results);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch tournament data');
      }
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      setError(error.message || 'An error occurred while fetching tournament data');
    } finally {
      setLoading(false);
    }
  };

  // Function to create round robin groups
  const createRoundRobinGroups = async (numGroups = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = numGroups ? { num_groups: numGroups } : {};
      const response = await axios.post(
        `${API_BASE_URL}/create_tournament_groups.php?tournament_id=${tournamentId}`,
        data
      );
      
      if (response.data.success) {
        // Fetch the newly created groups
        fetchTournamentGroups();
      } else {
        throw new Error(response.data.message || 'Failed to create groups');
      }
    } catch (error) {
      console.error('Error creating groups:', error);
      setError(error.message || 'An error occurred while creating groups');
      setLoading(false);
    }
  };

  // Function to save match result
  const handleSaveResult = async (updatedResult) => {
    console.log(updatedResult)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_match_result.php?match_id=${updatedResult.matchIndex}`,
        {
          team1_score: updatedResult.team1Score,
          team2_score: updatedResult.team2Score
        }
      );
      
      if (response.data.success) {
        // Refresh the tournament data to get updated standings
        fetchTournamentGroups();
        return true;
      } else {
        console.error('Error updating match result:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error updating match result:', error);
      return false;
    }
  };

  // Function to create playoffs
  const createPlayoffs = async () => {
    setPlayoffLoading(true);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create_tournament_playoffs.php?tournament_id=${tournamentId}`
      );
      
      if (response.data.success) {
        setPlayoffData(response.data.data);
        setActiveTab('playoffs'); // Switch to playoffs tab
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to create playoffs');
      }
    } catch (error) {
      console.error('Error creating playoffs:', error);
      setError(error.message || 'An error occurred while creating playoffs');
      return false;
    } finally {
      setPlayoffLoading(false);
    }
  };

  // Function to fetch playoff data
  const fetchPlayoffs = async () => {
    if (activeTab !== 'playoffs') return;
    
    setPlayoffLoading(true);
    
    try {
      const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_tournament_playoffs.php?tournament_id=${tournamentId}`
      );
      
      if (response.data.success) {
        setPlayoffData(response.data.data);
      } else {
        setPlayoffData(null); // No playoffs yet
      }
    } catch (error) {
      console.error('Error fetching playoffs:', error);
      setPlayoffData(null);
    } finally {
      setPlayoffLoading(false);
    }
  };

  // Fetch playoffs when switching to playoffs tab
  useEffect(() => {
    if (activeTab === 'playoffs') {
      fetchPlayoffs();
    }
  }, [activeTab]);

  // Handle opening the modal
  const handleOpenModal = (groupIndex) => {
    setModalGroupIndex(groupIndex);
    setIsModalOpen(true);
  };

  // Check if all matches are complete to enable playoff creation
  const areAllMatchesCompleted = () => {
    if (!groups.length) return false;
    
    for (const group of groups) {
      for (const roundKey in group.matches) {
        const round = group.matches[roundKey];
        for (const match of round) {
          if (match.status !== 'completed') {
            return false;
          }
        }
      }
    }
    
    return true;
  };

  // Get the current group's data
  const currentGroup = groups[selectedGroup] || { name: '', teams: [], matches: [], standings: [] };

  // Get current round matches for the selected group
  const currentRoundMatches = currentGroup.matches && currentGroup.matches[currentRound] 
    ? currentGroup.matches[currentRound] 
    : [];

  // Total number of rounds in the current group
  const totalRounds = currentGroup.matches ? Object.keys(currentGroup.matches).length : 0;

  // Render loading state
  if (loading && !groups.length) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-white">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-xl">Loading tournament data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !groups.length) {
    return (
      <div className="min-h-screen w-full text-white">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
        
        <button
          onClick={() => createRoundRobinGroups()}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Create Round Robin Groups
        </button>
      </div>
    );
  }

  // Render functions for different tab contents
  const renderTabContent = () => {
    switch (activeTab) {
      case 'groups':
        return (
          <GroupsOverview
            groups={groups}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            onOpenModal={handleOpenModal}
          />
        );
      // case 'playoffs':
      //   if (playoffLoading) {
      //     return (
      //       <div className="min-h-[400px] flex items-center justify-center">
      //         <FaSpinner className="animate-spin text-4xl text-primary mx-auto" />
      //         <p className="ml-3 text-lg">Loading playoff bracket...</p>
      //       </div>
      //     );
      //   }
        
      //   if (!playoffData || !playoffData.has_playoffs) {
      //     return (
      //       <div className="min-h-[400px] flex flex-col items-center justify-center">
      //         <p className="text-xl mb-6">No playoff bracket has been created yet.</p>
      //         <button
      //           onClick={createPlayoffs}
      //           disabled={!areAllMatchesCompleted()}
      //           className={`px-6 py-3 rounded-lg ${
      //             areAllMatchesCompleted() 
      //               ? 'bg-primary text-white hover:bg-orange-600' 
      //               : 'bg-gray-700 text-gray-400 cursor-not-allowed'
      //           } transition-colors`}
      //         >
      //           Create Playoff Bracket
      //         </button>
      //         {!areAllMatchesCompleted() && (
      //           <p className="text-sm text-gray-400 mt-3">
      //             All group matches must be completed before creating playoffs
      //           </p>
      //         )}
      //       </div>
      //     );
      //   }
        
      //   return <PlayoffsBracket bracketData={playoffData.bracket} />;
      
        default:
        return <GroupsOverview groups={groups} />;
    }
  };

  return (
    <div className="min-h-screen w-full text-white">
      {/* Tournament Header */}
       <div>
                <h1 className="text-4xl flex items-center font-custom tracking-wider uppercase">
                  Tournament Bracket
                </h1>
                <div className="flex items-center text-primary">
                  <TbTournament />
                  <p className="mx-2">
                  Teams divided into groups for round robin matches                  </p>
                </div>
              </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-800">
        <div className="flex justify-center overflow-x-auto py-2 space-x-2">
          <TabButton
            active={activeTab === 'groups'}
            onClick={() => setActiveTab('groups')}
            icon={<FaUserFriends className="mr-2" />}
            label="Groups Stage"
          />
          <TabButton
            active={activeTab === 'playoffs'}
            onClick={() => setActiveTab('playoffs')}
            icon={<FaTrophy className="mr-2" />}
            label="Playoffs"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent()}</div>
      
     
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-bold tracking-wider angular-cut flex items-center relative overflow-hidden group ${active
        ? 'text-primary'
        : 'text-white hover:text-primary'
      }`}
    style={{
      clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)",
      minWidth: "200px",
      transition: "all 0.3s ease-in-out"
    }}
    aria-pressed={active}
    aria-label={label}
  >
    {/* Background with transition */}
    <div
      className={`absolute inset-0 bg-dark z-0 transition-all duration-300 ease-in-out ${active ? 'border border-primary' : 'border border-transparent'
        }`}
      style={{
        clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)"
      }}
    />

    {/* Hover effect overlay */}
    <div
      className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-20 z-0 transition-opacity duration-300 ease-in-out"
      style={{
        clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)"
      }}
    />

    {/* Content with z-index to appear above backgrounds */}
    <div className="flex items-center z-10 relative transition-all duration-300">
      <span className={`mr-2 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </span>
      <span className="transition-all duration-300 ease-in-out">{label}</span>
    </div>
  </button>
);

// Groups Overview Component
const GroupsOverview = ({ groups, selectedGroup, setSelectedGroup, onOpenModal }) => {
  // Function to sort teams by wins in descending order
  const sortedGroups = groups.map(group => {
    if (group.standings) {
      // Create a copy of standings to avoid mutating the original data
      const sortedStandings = [...group.standings].sort((a, b) => {
        // Sort by wins in descending order
        return (b.wins || 0) - (a.wins || 0);
      });
      
      // Return a new group object with sorted standings
      return {
        ...group,
        standings: sortedStandings
      };
    }
    return group;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {sortedGroups.length === 0 ? (
        <div className="col-span-2 text-center py-10">
          <p className="text-xl mb-4">No groups have been created yet.</p>
          <p className="text-gray-400">Create groups to start the tournament.</p>
        </div>
      ) : (
        sortedGroups.map((group, index) => (
          <div
            key={group.id}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedGroup === index ? 'border-primary' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent selecting the group
              onOpenModal(index);
            }}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0 rounded"
                style={{
                  background: 'linear-gradient(135deg, #090808 0%, #090808 100%)'
                }}
              ></div>
            </div>

            {/* Group Card Content */}
            <div className="p-4 flex flex-col relative z-1 0 ">
              <h3 className="text-2xl font-custom tracking-widest mb-4 flex items-center">
                <span className={`text-primary mr-2 ${selectedGroup === index ? 'scale-110' : ''}`}>
                  <FaUserFriends />
                </span>
                {group.name}
              </h3> 

              <div className="space-y-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase">
                    <th className="py-2 w-10 text-center"></th>

                      <th className="py-2 w-10 text-center"></th>
                      <th className="py-2 text-left">Team</th>
                      <th className="py-2 w-12 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <FaFire size={10} className="text-green-400" /> W
                        </span>
                      </th>
                      <th className="py-2 w-12 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <FaEquals size={10} className="text-yellow-400" /> D
                        </span>
                      </th>
                      <th className="py-2 w-12 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <FaSkull size={10} className="text-red-400" /> L
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-4 divide-secondary">
                    {group.standings && group.standings.map((team, teamIndex) => (
                      <tr
                        key={team.team_id || teamIndex}
                        className="relative hover:bg-gray-800/50  transition-all duration-300"
                      >
                        {/* Background image container */}
                        <td colSpan={5} className="absolute inset-0 m-0 p-0 border-none">
                          <div className="absolute inset-0 z-0">
                            {/* Team logo or background image */}
                            {team.team_logo && (
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${team.team_logo})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'right center',
                                  opacity: 0.2,
                                }}
                              ></div>
                            )}

                            {/* Fade gradient overlay - Different for top positions */}
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  teamIndex === 0
                                    ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.0) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(255,215,0,0.1) 100%)'
                                    : teamIndex === 1
                                      ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.0) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(192,192,192,0.1) 100%)'
                                      : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.0) 40%, black 70%)',
                              }}
                            ></div>
                          </div>
                        </td>

                        {/* Rank Cell */}
                        <td className="py-2 text-center relative z-10 align-middle">
                          <span
                            className={`
                              inline-flex items-center justify-center w-3 h-3 rounded-full 
                              ${teamIndex === 0 ? 'text-yellow-300' : ''}
                              ${teamIndex === 1 ? 'text-gray-300' : ''}
                              ${teamIndex > 1 ? 'text-gray-400' : ''}
                              font-bold text-sm
                            `}
                          >
                            {teamIndex + 1}
                          </span>
                        </td>

                        {/* Team Name */}
                        <td className="py-2 text-left relative z-10 pl-2 align-middle">
                          <div className="flex items-center">
                            <span
                              className={`font-valorant hover:text-primary transition-all duration-300 relative group text-sm ${
                                teamIndex < 2 ? 'text-white ' : 'text-white'
                              }`}
                            >
                              {team.team_name}
                              <span className="absolute -bottom-1 font-base left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                            </span>
                          </div>
                        </td>

                        {/* Wins */}
                        <td className="py-2 text-center relative z-10 align-middle">
                          <div className="transition-all text-sm font-free-fire text-green-400 duration-300 hover:font-bold">
                            {team.wins || 0}
                          </div>
                        </td>

                        {/* Draws */}
                        <td className="py-2 text-center relative z-10 align-middle">
                          <div className="transition-all text-sm font-free-fire text-yellow-400 duration-300 hover:font-bold">
                            {team.draws || 0}
                          </div>
                        </td>

                        {/* Losses */}
                        <td className="py-2 text-center relative z-10 align-middle">
                          <div className="transition-all text-sm font-free-fire text-red-400 duration-300 hover:font-bold">
                            {team.losses || 0}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MultiGroupRoundRobinTournament;