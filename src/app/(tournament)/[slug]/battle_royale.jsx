import React, { useState, useEffect, useRef } from 'react';
import { TbTournament } from 'react-icons/tb';
import {
  FaLock,
  FaUnlock,
  FaEdit,
  FaSearch,
  FaPlus,
  FaSave,
  FaTimes,
  FaSpinner,
  FaSkull,
  FaMedal,
} from 'react-icons/fa';
import { Plus, Search, Trophy, X } from 'lucide-react';
import axios from 'axios';

// Fake data for development and testing
const FAKE_BATTLE_ROYALE_DATA = {
  success: true,
  tournament: {
    id: 2,
    name: 'Apex Legends Championship',
    description: 'Season 5 Battle Royale Tournament',
    start_date: '2023-09-15',
    end_date: '2023-10-30',
    status: 'active',
    game: 'Apex Legends',
    format: 'battle_royale',
  },
  settings: {
    kill_points: 1,
    placement_points: {
      1: 12,
      2: 9,
      3: 7,
      4: 5,
      5: 4,
      6: 3,
      7: 2,
      8: 1,
    },
    max_teams: 20,
    matches_per_round: 5,
  },
  participants: [
    {
      participant_id: 1,
      participant_name: 'Team Liquid',
      participant_image: '/uploads/teams/team_liquid.png',
      total_kills: 45,
      total_placement_points: 32,
      total_points: 77,
      matches_played: 5,
    },
    {
      participant_id: 2,
      participant_name: 'Cloud9',
      participant_image: '/uploads/teams/cloud9.png',
      total_kills: 38,
      total_placement_points: 27,
      total_points: 65,
      matches_played: 5,
    },
    {
      participant_id: 3,
      participant_name: 'TSM',
      participant_image: '/uploads/teams/tsm.png',
      total_kills: 36,
      total_placement_points: 25,
      total_points: 61,
      matches_played: 5,
    },
    {
      participant_id: 4,
      participant_name: '100 Thieves',
      participant_image: '/uploads/teams/100thieves.png',
      total_kills: 32,
      total_placement_points: 24,
      total_points: 56,
      matches_played: 5,
    },
    {
      participant_id: 5,
      participant_name: 'NRG',
      participant_image: '/uploads/teams/nrg.png',
      total_kills: 29,
      total_placement_points: 22,
      total_points: 51,
      matches_played: 5,
    },
    {
      participant_id: 6,
      participant_name: 'Sentinels',
      participant_image: '/uploads/teams/sentinels.png',
      total_kills: 27,
      total_placement_points: 18,
      total_points: 45,
      matches_played: 5,
    },
    {
      participant_id: 7,
      participant_name: 'G2 Esports',
      participant_image: '/uploads/teams/g2.png',
      total_kills: 25,
      total_placement_points: 19,
      total_points: 44,
      matches_played: 5,
    },
    {
      participant_id: 8,
      participant_name: 'Fnatic',
      participant_image: '/uploads/teams/fnatic.png',
      total_kills: 24,
      total_placement_points: 16,
      total_points: 40,
      matches_played: 5,
    },
    {
      participant_id: 9,
      participant_name: 'FaZe Clan',
      participant_image: '/uploads/teams/faze.png',
      total_kills: 22,
      total_placement_points: 15,
      total_points: 37,
      matches_played: 5,
    },
    {
      participant_id: 10,
      participant_name: 'Team Envy',
      participant_image: '/uploads/teams/envy.png',
      total_kills: 20,
      total_placement_points: 14,
      total_points: 34,
      matches_played: 5,
    },
    {
      participant_id: 11,
      participant_name: 'Complexity',
      participant_image: '/uploads/teams/complexity.png',
      total_kills: 18,
      total_placement_points: 12,
      total_points: 30,
      matches_played: 5,
    },
    {
      participant_id: 12,
      participant_name: 'Rogue',
      participant_image: '/uploads/teams/rogue.png',
      total_kills: 17,
      total_placement_points: 11,
      total_points: 28,
      matches_played: 5,
    },
    {
      participant_id: 13,
      participant_name: 'Luminosity',
      participant_image: '/uploads/teams/luminosity.png',
      total_kills: 15,
      total_placement_points: 10,
      total_points: 25,
      matches_played: 5,
    },
    {
      participant_id: 14,
      participant_name: 'Spacestation',
      participant_image: '/uploads/teams/spacestation.png',
      total_kills: 14,
      total_placement_points: 9,
      total_points: 23,
      matches_played: 5,
    },
    {
      participant_id: 15,
      participant_name: 'Team SoloMid',
      participant_image: '/uploads/teams/tsm_alt.png',
      total_kills: 12,
      total_placement_points: 8,
      total_points: 20,
      matches_played: 5,
    },
  ],
  matches: [
    {
      match_id: 1,
      match_name: 'Match 1',
      match_date: '2023-09-15',
      results: [
        { participant_id: 1, position: 1, kills: 9 },
        { participant_id: 3, position: 2, kills: 8 },
        { participant_id: 2, position: 3, kills: 7 },
        { participant_id: 5, position: 4, kills: 6 },
        { participant_id: 4, position: 5, kills: 5 },
        { participant_id: 7, position: 6, kills: 5 },
        { participant_id: 6, position: 7, kills: 4 },
        { participant_id: 9, position: 8, kills: 4 },
        { participant_id: 8, position: 9, kills: 3 },
        { participant_id: 10, position: 10, kills: 3 },
        { participant_id: 11, position: 11, kills: 2 },
        { participant_id: 12, position: 12, kills: 2 },
        { participant_id: 13, position: 13, kills: 1 },
        { participant_id: 14, position: 14, kills: 1 },
        { participant_id: 15, position: 15, kills: 0 },
      ],
    },
    {
      match_id: 2,
      match_name: 'Match 2',
      match_date: '2023-09-22',
      results: [
        { participant_id: 2, position: 1, kills: 10 },
        { participant_id: 1, position: 2, kills: 8 },
        { participant_id: 4, position: 3, kills: 7 },
        { participant_id: 6, position: 4, kills: 6 },
        { participant_id: 3, position: 5, kills: 5 },
        { participant_id: 8, position: 6, kills: 5 },
        { participant_id: 5, position: 7, kills: 4 },
        { participant_id: 10, position: 8, kills: 4 },
        { participant_id: 7, position: 9, kills: 3 },
        { participant_id: 9, position: 10, kills: 3 },
        { participant_id: 12, position: 11, kills: 2 },
        { participant_id: 11, position: 12, kills: 2 },
        { participant_id: 14, position: 13, kills: 1 },
        { participant_id: 13, position: 14, kills: 1 },
        { participant_id: 15, position: 15, kills: 0 },
      ],
    },
    {
      match_id: 3,
      match_name: 'Match 3',
      match_date: '2023-09-29',
      results: [
        { participant_id: 3, position: 1, kills: 9 },
        { participant_id: 5, position: 2, kills: 8 },
        { participant_id: 1, position: 3, kills: 7 },
        { participant_id: 7, position: 4, kills: 6 },
        { participant_id: 2, position: 5, kills: 5 },
        { participant_id: 9, position: 6, kills: 5 },
        { participant_id: 4, position: 7, kills: 4 },
        { participant_id: 11, position: 8, kills: 4 },
        { participant_id: 6, position: 9, kills: 3 },
        { participant_id: 8, position: 10, kills: 3 },
        { participant_id: 13, position: 11, kills: 2 },
        { participant_id: 10, position: 12, kills: 2 },
        { participant_id: 15, position: 13, kills: 1 },
        { participant_id: 12, position: 14, kills: 1 },
        { participant_id: 14, position: 15, kills: 0 },
      ],
    },
    {
      match_id: 4,
      match_name: 'Match 4',
      match_date: '2023-10-06',
      results: [
        { participant_id: 1, position: 1, kills: 11 },
        { participant_id: 4, position: 2, kills: 9 },
        { participant_id: 2, position: 3, kills: 8 },
        { participant_id: 8, position: 4, kills: 7 },
        { participant_id: 5, position: 5, kills: 6 },
        { participant_id: 10, position: 6, kills: 5 },
        { participant_id: 3, position: 7, kills: 4 },
        { participant_id: 12, position: 8, kills: 4 },
        { participant_id: 6, position: 9, kills: 3 },
        { participant_id: 7, position: 10, kills: 3 },
        { participant_id: 14, position: 11, kills: 2 },
        { participant_id: 9, position: 12, kills: 2 },
        { participant_id: 11, position: 13, kills: 1 },
        { participant_id: 13, position: 14, kills: 1 },
        { participant_id: 15, position: 15, kills: 0 },
      ],
    },
    {
      match_id: 5,
      match_name: 'Match 5',
      match_date: '2023-10-13',
      results: [
        { participant_id: 1, position: 1, kills: 10 },
        { participant_id: 2, position: 2, kills: 8 },
        { participant_id: 3, position: 3, kills: 7 },
        { participant_id: 4, position: 4, kills: 5 },
        { participant_id: 5, position: 5, kills: 4 },
        { participant_id: 6, position: 6, kills: 5 },
        { participant_id: 7, position: 7, kills: 4 },
        { participant_id: 8, position: 8, kills: 4 },
        { participant_id: 9, position: 9, kills: 3 },
        { participant_id: 10, position: 10, kills: 3 },
        { participant_id: 11, position: 11, kills: 2 },
        { participant_id: 12, position: 12, kills: 2 },
        { participant_id: 13, position: 13, kills: 1 },
        { participant_id: 14, position: 14, kills: 1 },
        { participant_id: 15, position: 15, kills: 0 },
      ],
    },
  ],
};

// Function to simulate API response delay
const getFakeBattleRoyaleData = (tournamentId = 2, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(FAKE_BATTLE_ROYALE_DATA);
    }, delay);
  });
};

const BattleRoyale = ({ tournamentId }) => {
  // State variables
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournamentInfo, setTournamentInfo] = useState(null);
  const [settings, setSettings] = useState(null);
  // Create refs for each input
  const killsInputRef = useRef(null);
  const placementPointsInputRef = useRef(null);
  // Editing state
  const [editingTeam, setEditingTeam] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Track which input is focused
  const [focusedInput, setFocusedInput] = useState(null);
  // Create ref for the search input
  const searchInputRef = useRef(null);
  // Search state - This was missing
  const [searchTerm, setSearchTerm] = useState('');
  // Track input focus
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Effect to restore focus after render
  useEffect(() => {
    if (isSearchFocused && searchInputRef.current) {
      searchInputRef.current.focus();

      // Place cursor at the end of input text
      const length = searchInputRef.current.value.length;
      searchInputRef.current.setSelectionRange(length, length);
    }
  }, [searchTerm, isSearchFocused]);
  // Effect to restore focus after render
  useEffect(() => {
    if (focusedInput === 'kills' && killsInputRef.current) {
      killsInputRef.current.focus();

      // Place cursor at the end of input text
      const length = killsInputRef.current.value.length;
      killsInputRef.current.setSelectionRange(length, length);
    } else if (focusedInput === 'placement' && placementPointsInputRef.current) {
      placementPointsInputRef.current.focus();

      // Place cursor at the end of input text
      const length = placementPointsInputRef.current.value.length;
      placementPointsInputRef.current.setSelectionRange(length, length);
    }
  }, [editingTeam, focusedInput]);
  // Admin modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Match results state
  const [newMatchResults, setNewMatchResults] = useState([]);
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [savingMatch, setSavingMatch] = useState(false);



  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);

        // Use fake data in development mode
        if (false) {
          const fakeData = await getFakeBattleRoyaleData(tournamentId);
          setTeams(fakeData.participants);
          setTournamentInfo(fakeData.tournament);
          setSettings(fakeData.settings);
          console.log('Using fake data:', fakeData.participants);
        } else {
          // Use real API in production
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
          const response = await axios.get(
            `${backendUrl}/api/get_battle_royale_leaderboard.php?tournament_id=${
              tournamentId || 2
            }`,
          );

          if (response.data.success) {
            setTeams(response.data.participants);
            console.log(response.data.participants);
            setTournamentInfo(response.data.tournament);
            setSettings(response.data.settings);
          } else {
            setError(response.data.message || 'Failed to load leaderboard data');
          }
        }
      } catch (err) {
        setError('Error connecting to server: ' + (err.message || 'Unknown error'));
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [tournamentId]);

  // Filter teams based on search term
  const filteredTeams = Array.isArray(teams)
    ? teams.filter(
        (team) =>
          team.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.team_id?.toString().includes(searchTerm) ||
          team.total_points?.toString().includes(searchTerm),
      )
    : [];

  // Handle edit click
  const handleEditClick = (team) => {
    setEditingTeam({ ...team });
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setEditingTeam(null);
    setShowEditModal(false);
  };

  // Initialize match results form
  const initializeNewMatch = () => {
    // Use teams data from the leaderboard
    const initialResults = teams.map((team) => ({
      team_id: team.team_id,
      team_name: team.team_name,
      position: 0,
      kills: 0,
    }));

    setNewMatchResults(initialResults);
    setShowAddMatchForm(true);
  };

  const handleMatchResultChange = (teamId, field, value) => {
    // Keep input as string during editing, only parse when submitting
    setNewMatchResults((prev) =>
      prev.map((result) => (result.team_id === teamId ? { ...result, [field]: value } : result)),
    );
  };

  const handleSaveMatchResults = async () => {
    try {
      // Validate results before saving
      const validResults = newMatchResults.filter((r) => r.position > 0);
      if (validResults.length === 0) {
        alert('Please set positions for at least one team');
        return;
      }

      // Check for duplicate positions
      const positions = validResults.map((r) => r.position);
      if (new Set(positions).size !== positions.length) {
        alert('Each team must have a unique position');
        return;
      }

      setSavingMatch(true);

      // Parse string values to integers before sending to server
      const parsedResults = newMatchResults.map((result) => ({
        ...result,
        position: parseInt(result.position) || 0,
        kills: parseInt(result.kills) || 0,
      }));

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const response = await axios.post(`${backendUrl}/api/save_battle_royale_match_results.php`, {
        tournament_id: tournamentId,
        results: parsedResults,
      });

      if (response.data.success) {
        // Refresh leaderboard data
        const leaderboardResponse = await axios.get(
          `${backendUrl}/api/get_battle_royale_leaderboard.php?tournament_id=${tournamentId}`,
        );

        if (leaderboardResponse.data.success) {
          setTeams(leaderboardResponse.data.data);
        }

        setShowAddMatchForm(false);
        setNewMatchResults([]);
        alert('Match results saved successfully!');
      } else {
        setError(response.data.message || 'Failed to save match results');
        alert('Failed to save match results: ' + response.data.message);
      }
    } catch (err) {
      setError('Error saving match results: ' + (err.message || 'Unknown error'));
      console.error('Error saving match results:', err);
      alert('Error saving results. Please try again.');
    } finally {
      setSavingMatch(false);
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Header component
  const Header = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl flex items-center font-custom tracking-wider uppercase">
            Tournament Bracket
          </h1>
          <div className="flex items-center text-primary">
            <TbTournament />
            <p className="mx-2">
              {tournamentInfo ? tournamentInfo.name : 'Tournament'} standings and statistics
            </p>
          </div>
        </div>

        {/* Admin toggle button */}
      </div>
    </div>
  );

  // const EditTeamModal = () => {
  //   if (!showEditModal || !editingTeam) return null;

  //   // Instead of using handleMatchResultChange which is designed for the match results form,
  //   // create a specialized handler for the team edit form
  //   const handleTeamStatChange = (field, value) => {
  //     // Only allow numeric input
  //     if (value === '' || /^\d+$/.test(value)) {
  //       setEditingTeam(prev => ({
  //         ...prev,
  //         [field]: value
  //       }));
  //     }
  //   };

  //   // Calculate total points based on current input values
  //   const totalPoints = parseInt(editingTeam.total_kills || 0) + parseInt(editingTeam.total_placement_points || 0);

  //   return (
  //     <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center backdrop-blur-sm transition-all duration-300">
  //       <div
  //         className="bg-secondary shadow-2xl w-full max-w-md mx-4 overflow-hidden relative"

  //       >
  //         {/* Header with team image background */}
  //         <div className="relative overflow-hidden">
  //           {/* Team image background */}
  //           {editingTeam.team_image && (
  //             <div className="absolute inset-0 z-0">
  //               <div
  //                 className="absolute inset-0 bg-cover bg-center z-0"
  //                 style={{backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${editingTeam.team_image})`, opacity: 0.2, transform: 'scale(1.1)'}}
  //               ></div>
  //             </div>
  //           )}

  //           <div className="relative z-20 px-6 pt-4 pb-3">
  //             <div className="flex items-center justify-between">
  //               <div className="flex items-center">
  //                 {/* Team name with enhanced typography */}
  //                 <div>
  //                   <span className="text-xs text-gray-400 uppercase tracking-wider">Editing Team</span>
  //                   <h2 className="text-lg font-bold text-white uppercase tracking-wide leading-tight">
  //                     {editingTeam.team_name}
  //                   </h2>
  //                 </div>
  //               </div>

  //               {/* Close button with better hover effect */}
  //               <button
  //                 onClick={handleEditCancel}
  //                 className="rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all duration-200"
  //               >
  //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  //                   <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  //                 </svg>
  //               </button>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Main content area with refined spacing */}
  //         <div className="px-6 py-4">
  //           {/* Inputs area with improved visual design */}
  //           <div className="grid grid-cols-2 gap-4 mb-6">
  //             {/* Kills Input */}
  //             <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 p-3 hover:border-blue-500/30 transition-colors duration-300 group relative overflow-hidden">
  //               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

  //               <div className="flex flex-col items-center justify-center mb-2 relative z-10">
  //                 <div className="w-12 h-12 rounded-full bg-blue-900/50 border border-blue-700/30 flex items-center justify-center mb-2 shadow-sm">
  //                   <span className="text-blue-400 text-xl font-bold">k</span>
  //                 </div>
  //                 <label className="block text-gray-300 text-sm uppercase tracking-wider font-medium">Kills</label>
  //               </div>

  //               <div className="relative">
  //                 <input
  //                   type="text"
  //                   inputMode="numeric"
  //                   pattern="[0-9]*"
  //                   value={editingTeam.total_kills || ''}
  //                   onChange={(e) => handleTeamStatChange('total_kills', e.target.value)}
  //                   className="w-full bg-gray-900/80 text-white text-center text-xl px-2 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 border-b border-blue-600/50 relative z-10"
  //                 />
  //                 <div className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
  //               </div>
  //             </div>

  //             {/* Placement Points Input */}
  //             <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 p-3 hover:border-teal-500/30 transition-colors duration-300 group relative overflow-hidden">
  //               <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

  //               <div className="flex flex-col items-center justify-center mb-2 relative z-10">
  //                 <div className="w-12 h-12 rounded-full bg-teal-900/50 border border-teal-700/30 flex items-center justify-center mb-2 shadow-sm">
  //                   <span className="text-teal-400 text-xl font-bold">PP</span>
  //                 </div>
  //                 <label className="block text-gray-300 text-sm uppercase tracking-wider font-medium">Placement Points</label>
  //               </div>

  //               <div className="relative">
  //                 <input
  //                   type="text"
  //                   inputMode="numeric"
  //                   pattern="[0-9]*"
  //                   value={editingTeam.total_placement_points || ''}
  //                   onChange={(e) => handleTeamStatChange('total_placement_points', e.target.value)}
  //                   className="w-full bg-gray-900/80 text-white text-center text-xl px-2 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 border-b border-teal-600/50 relative z-10"
  //                 />
  //                 <div className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Total Points with visual impact */}
  //           <div className="mt-6 text-center bg-gray-800/50 py-4 rounded-lg border border-gray-700">
  //             <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Total Score</p>
  //             <span className="font-bold text-primary text-4xl block">{totalPoints}</span>
  //             <div className="w-16 h-1 bg-primary mx-auto mt-2 rounded-full"></div>
  //           </div>
  //         </div>

  //         {/* Footer with improved buttons */}
  //         <div className="bg-gray-900/80 px-6 py-4 flex justify-between border-t border-gray-800/50">
  //           <button
  //             onClick={handleEditCancel}
  //             className="text-gray-300 py-2 px-4 rounded transition duration-200 flex items-center"
  //           >
  //             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //             Cancel
  //           </button>

  //           <button
  //             onClick={handleUpdateTeam}
  //             className="relative overflow-hidden bg-primary hover:bg-primary/90 text-white py-2 px-4 angular-cut transition duration-200 flex items-center group"
  //           >
  //             <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
  //             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //             </svg>
  //             <span className="relative z-10">Update</span>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // Add Match Results Form
  // Add Match Results Form

  const handleUpdateTeam = async () => {
    try {
      // Convert string values to integers before updating
      const updatedTeam = {
        ...editingTeam,
        total_kills: parseInt(editingTeam.total_kills || 0),
        total_placement_points: parseInt(editingTeam.total_placement_points || 0),
        total_points:
          parseInt(editingTeam.total_kills || 0) +
          parseInt(editingTeam.total_placement_points || 0),
      };

      // Show loading state
      setSavingMatch(true);

      // Prepare the data object based on tournament participation type
      const resultData = {
        tournament_id: tournamentId,
        results: [
          {
            position: updatedTeam.position || 1, // Default to position 1 if not specified
            kills: updatedTeam.total_kills || 0,
            team_id: updatedTeam.participant_id, // Use team_id for all participant types
            // Include placement_points to prevent the backend from recalculating them
            placement_points: updatedTeam.total_placement_points || 0,
          },
        ],
      };

      console.log('Sending data to backend:', resultData);

      // Make API call to update in database
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const response = await axios.post(
        `${backendUrl}/api/save_battle_royale_match_results.php`,
        resultData,
      );

      if (response.data.success) {
        // Update local state after successful database update
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.participant_id === updatedTeam.participant_id ? updatedTeam : team,
          ),
        );

        // Close the modal
        setEditingTeam(null);
        setShowEditModal(false);

        // Optional: Show success message
        console.log(
          `${
            tournamentInfo?.participation_type === 'individual' ? 'Player' : 'Team'
          } stats updated successfully!`,
        );

       
      } else {
        throw new Error(response.data.message || 'Failed to update stats');
      }
    } catch (err) {
      console.error('Error updating stats:', err);
      alert(
        `Failed to update ${
          tournamentInfo?.participation_type === 'individual' ? 'player' : 'team'
        } stats: ${err.message}`,
      );
    } finally {
      setSavingMatch(false);
    }
  };
  // Replace your existing EditTeamModal with this improved version
  const EditTeamModal = () => {
    if (!showEditModal || !editingTeam) return null;

    const handleTeamStatChange = (field, value) => {
      // Only allow numeric input
      if (value === '' || /^\d+$/.test(value)) {
        // Record which input is focused
        if (field === 'total_kills') {
          setFocusedInput('kills');
        } else if (field === 'total_placement_points') {
          setFocusedInput('placement');
        }

        // Use functional update to ensure we're working with the latest state
        setEditingTeam((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    };

    // Calculate total for display
    const totalPoints =
      parseInt(editingTeam.total_kills || 0) + parseInt(editingTeam.total_placement_points || 0);

    return (
      <div className="fixed inset-0 bg-black/75 z-[999999999999999999999999] flex items-center justify-center backdrop-blur-sm">
        <div className="bg-gradient-to-b from-secondary to-secondary/70 shadow-2xl w-full max-w-2xl mx-4 overflow-hidden relative">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/15 to-primary"></div>

          {/* Header with team image background */}
          <div className="relative overflow-hidden">
            {/* Team image background */}
            {editingTeam.image && (
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 bg-cover bg-center z-0 filter blur-sm"
                  style={{ backgroundImage: `url(${editingTeam.image})`, opacity: 0.15 }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent"></div>
              </div>
            )}

            <div className="relative z-20 px-6 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Team logo/icon */}
                  {editingTeam.logo && (
                    <div className="w-10 h-10 rounded-md overflow-hidden ring-2 ring-white/20 shadow-lg">
                      <img
                        src={editingTeam.logo}
                        alt="Team logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Team name */}
                  <div>
                    <span className="text-xs text-blue-300 uppercase tracking-wider font-mono">
                      Editing Team
                    </span>
                    <h2 className="text-xl font-valorant text-white uppercase tracking-wide leading-tight group-hover:text-blue-300 transition-colors">
                      {editingTeam.team_name}
                    </h2>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={handleEditCancel}
                  className="rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 hover:shadow-inner transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="px-6 py-5">
            {/* Inputs area */}
            <div className="grid grid-cols-2 gap-8 mb-8 px-4">
              {/* Kills Input */}
              <div className="angular-cut p-4 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex flex-col items-center justify-center mb-3 relative z-10">
                  <label className="block text-gray-300 text-2xl uppercase tracking-wider font-free-fire">
                    Kills
                  </label>
                </div>

                <div className="relative">
                  <input
                    ref={killsInputRef}
                    type="text"
                    name="kills"
                    value={editingTeam.total_kills || ''}
                    onChange={(e) => handleTeamStatChange('total_kills', e.target.value)}
                    onFocus={() => setFocusedInput('kills')}
                    className="w-full bg-gray-900/80 font-ea-football text-white text-center text-4xl px-4 py-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 border-b-2 border-blue-600/50 relative z-10 transition-all"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>

              {/* Class Points Input */}
              <div className="angular-cut p-4 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex flex-col items-center justify-between mb-4 relative z-10">
                  <label className="block text-gray-300 text-2xl uppercase tracking-wider font-free-fire">
                    Class Points
                  </label>
                </div>

                <div className="relative">
                  <input
                    ref={placementPointsInputRef}
                    type="text"
                    name="classPoints"
                    value={editingTeam.total_placement_points || ''}
                    onChange={(e) => handleTeamStatChange('total_placement_points', e.target.value)}
                    onFocus={() => setFocusedInput('placement')}
                    className="w-full bg-gray-900/80 font-ea-football text-white text-center text-4xl px-4 py-6 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 border-b-2 border-purple-600/50 relative z-10 transition-all"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/70 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            </div>

            {/* Total Points */}
            <div className="mt-8 text-center bg-gradient-to-b from-gray-800/70 to-secondary/70 py-6 rounded-lg shadow-inner relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 mx-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <p className="text-gray-300 text-xl uppercase tracking-wider font-free-fire mb-1">
                Total Score
              </p>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary/75 to-primary text-5xl block my-2">
                {totalPoints}
              </span>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary mx-auto mt-3 rounded-full"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-secondary px-6 py-4 flex justify-between border-t border-gray-800">
            <button
              onClick={handleEditCancel}
              className="text-gray-300 hover:text-white py-2 px-4 rounded-md transition duration-200 flex items-center hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-gray-500/30"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </button>

            <button
              onClick={handleUpdateTeam}
              className="relative overflow-hidden bg-gradient-to-r from-primary to-primary text-white py-3 px-5 angular-cut shadow-md hover:shadow-lg transition-all duration-200 flex items-center group focus:outline-none"
              type="button"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="relative z-10">Update Team</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Replace your existing AdminModal with this improved version
  const AdminModal = () => {
    if (!isAdminModalOpen) return null;

    // Handle search input changes
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setIsSearchFocused(true);
    };

    return (
      <div className="fixed inset-0 bg-dark backdrop-blur-sm z-[99999999999999999999999] overflow-y-auto">
        <div className="container mx-auto p-4 md:p-8 max-w-9xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl md:text-7xl font-custom tracking-wider bg-primary bg-clip-text text-transparent">
              Leaderboard Management
            </h2>
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              <X className="text-primary hover:text-white w-6 h-6" />
            </button>
          </div>

          {/* Leaderboard Management Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex flex-col md:flex-row w-full md:w-2/4">
                <div className="relative w-full max-w-9xl">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="text-gray-400 w-4 h-4" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full bg-gray-800/50 text-white py-3 px-10 angular-cut focus:outline-none focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div>
              {/* Teams table */}
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead className="angular-cut bg-secondary text-gray-300 font-mono uppercase text-sm">
                    <tr>
                      <th className="py-3 text-left text-base">#</th>
                      <th className="py-3 text-left text-base">Team</th>
                      <th className="py-3 text-center text-base">Kills</th>
                      <th className="py-3 text-center text-base">Class Points</th>
                      <th className="py-3 text-center text-base">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-8 divide-gray-800">
                    {teams.length > 0 ? (
                      teams.map((team, index) => (
                        <tr
                          onClick={() => handleEditClick(team)}
                          key={team.participant_id}
                          className="cursor-pointer bg-gray-800/30 hover:bg-gray-700/40 transition-colors duration-200"
                        >
                          <td className="py-4">{index + 1}</td>
                          <td className="py-4">{team.participant_name}</td>
                          <td className="py-4 text-center">{team.total_kills}</td>
                          <td className="py-4 text-center">{team.total_placement_points}</td>
                          <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                            <div
                              className={`transition-all text-xl duration-300 ${
                                index < 3
                                  ? 'text-white font-free-fire'
                                  : 'text-primary font-free-fire'
                              } text-lg hover:font-bold`}
                            >
                              {team.total_points}
                              <span className="ml-2 font-normal">pts</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-400">
                          No teams found matching {searchTerm}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Results count */}
                <div className="mt-3 text-gray-400 text-sm">
                  {searchTerm
                    ? `Found ${filteredTeams.length} team${
                        filteredTeams.length !== 1 ? 's' : ''
                      } matching "${searchTerm}"`
                    : `Showing all ${teams.length} teams`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-white">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-xl">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-white">
        <div className="text-center max-w-lg">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white py-2 px-4 angular-cut hover:bg-primary/90 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white">
      {/* Tournament Table */}

      <Header />
      <table className="w-full border-collapse table-fixed">
        {/* Table Header */}
        <thead className="bg-secondary text-gray-300 font-mono uppercase text-sm">
          <tr>
            <th className="py-3 w-3/12 text-left text-base"></th>

            <th className="py-3 w-1/12 text-left text-base">#</th>
            <th className="py-3 w-3/12 text-left text-base">Team</th>
            <th className="py-3 w-2/12 text-center text-base">Kills</th>
            <th className="py-3 w-2/12 text-center text-base">Placement Points</th>
            <th className="py-3 w-2/12 text-center text-base">Total</th>
          </tr>
        </thead>

        {/* Add spacing between thead and tbody */}
        <tr className="h-2 bg-transparent"></tr>

        <tbody className="divide-y-8 divide-gray-800/30">
          {teams.length > 0 &&
            teams.slice(0, 10).map((team, index) => (
              <tr
                key={team.participant_id}
                className="angular-cut hover:bg-gray-800/30 cursor-pointer relative"
              >
                {/* Background image container */}
                <td colSpan={6} className="absolute inset-0 m-0 p-0 border-none">
                  <div className="absolute inset-0 z-0">
                    {/* Team logo or background image */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: team.participant_image
                          ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${team.participant_image})`
                          : '',
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        opacity: 0.5,
                      }}
                    ></div>

                    {/* Fade gradient overlay - Different for top 3 with gold, silver, bronze */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          index === 0
                            ? 'linear-gradient(to right, transparent 0%,rgba(255,215,0,0.0) 20%, rgba(255,215,0,0.5) 40%, rgba(218,165,32,1) 70%)' // Gold gradient for 1st
                            : index === 1
                            ? 'linear-gradient(to right, transparent 0%, rgba(192,192,192,0.3) 40%, rgba(169,169,169,0.6) 70%)' // Silver gradient for 2nd
                            : index === 2
                            ? 'linear-gradient(to right, transparent 0%, rgba(205,127,50,0.3) 40%, rgba(184,115,51,0.6) 70%)' // Bronze gradient for 3rd
                            : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%)', // Original dark gradient for others
                      }}
                    ></div>
                  </div>
                </td>

                {/* Rank Cell */}
                <td className="py-4 w-1/12 text-center font-custom relative z-10 align-middle">
                  <div
                    className={`inline-block w-8 h-8 rounded-full ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-300 to-yellow-600' // Gold for 1st
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-300 to-gray-500' // Silver for 2nd
                        : index === 2
                        ? 'bg-gradient-to-r from-amber-600 to-amber-800' // Bronze for 3rd
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-600' // Default yellow
                    } text-black font-bold flex items-center justify-center`}
                  >
                    {index + 1}
                  </div>
                </td>

                {/* Team Name Cell */}
                <td className="py-4 w-3/12 text-left relative z-10 pl-2 align-middle">
                  <span
                    className={`font-valorant hover:text-primary transition-all duration-300 relative group ${
                      index < 3 ? 'text-white font-bold' : 'text-white'
                    }`}
                  >
                    {team.participant_name}
                    <span className="absolute -bottom-1 font-base left-0 w-0 h-0.5 bg-primtext-primary group-hover:w-full transition-all duration-300"></span>
                  </span>
                </td>

                {/* Kill Points Cell */}
                <td className="py-4 w-2/12 text-center relative z-10 align-middle">
                  <div className="transition-all font-base duration-300 hover:font-bold">
                    {team.total_kills}
                  </div>
                </td>

                {/* Placement Points Cell */}
                <td className="py-4 w-2/12 text-center relative z-10 align-middle">
                  <div className="transition-all font-base duration-300 hover:font-bold">
                    {team.total_placement_points}
                  </div>
                </td>

                {/* Total Points Cell */}
                <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                  <div
                    className={`transition-all duration-300 ${
                      index < 3
                        ? 'text-white text-xl font-free-fire'
                        : 'text-primary font-free-fire'
                    } text-lg hover:font-bold`}
                  >
                    {team.total_points}
                    <span className="ml-2  font-normal">pts</span>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    
     
    </div>
  );
};
export default BattleRoyale;
