import React, { useState, useEffect } from 'react';
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
  FaMedal
} from 'react-icons/fa';
import { Plus, Search, Trophy, X } from 'lucide-react';
import axios from 'axios';

const BattleRoyale = ({ tournamentId }) => {

  // State variables
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournamentInfo, setTournamentInfo] = useState(null);
  const [settings, setSettings] = useState(null);

  // Admin modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Editing state
  const [editingTeam, setEditingTeam] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Match results state
  const [newMatchResults, setNewMatchResults] = useState([]);
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [savingMatch, setSavingMatch] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
        const response = await axios.get(`${backendUrl}/api/get_battle_royale_leaderboard.php?tournament_id=${tournamentId}`);

        if (response.data.success) {
          setTeams(response.data.data);
          setTournamentInfo(response.data.tournament);
          setSettings(response.data.settings);
        } else {
          setError(response.data.message || 'Failed to load leaderboard data');
        }
      } catch (err) {
        setError('Error connecting to server: ' + (err.message || 'Unknown error'));
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId) {
      fetchLeaderboardData();
    } else {
      setError('No tournament ID provided');
      setLoading(false);
    }
  }, [tournamentId]);
  const handleUpdateTeam = async () => {
    try {
      // Convert string values to integers before updating
      const updatedTeam = {
        ...editingTeam,
        total_kills: parseInt(editingTeam.total_kills || 0),
        total_placement_points: parseInt(editingTeam.total_placement_points || 0),
        total_points: parseInt(editingTeam.total_kills || 0) + parseInt(editingTeam.total_placement_points || 0)
      };

      // You would normally send this to the backend for persistence
      // For now, we'll just update the state locally
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.team_id === updatedTeam.team_id ? updatedTeam : team
        )
      );

      // Close the modal
      setEditingTeam(null);
      setShowEditModal(false);



    } catch (err) {
      console.error('Error updating team stats:', err);
      alert('Failed to update team stats. Please try again.');
    }
  };
  // Filter teams based on search term
  const filteredTeams = teams.filter(
    (team) =>
      team.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.team_id?.toString().includes(searchTerm) ||
      team.total_points?.toString().includes(searchTerm),
  );

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
    const initialResults = teams.map(team => ({
      team_id: team.team_id,
      team_name: team.team_name,
      position: 0,
      kills: 0
    }));

    setNewMatchResults(initialResults);
    setShowAddMatchForm(true);
  };

  const handleMatchResultChange = (teamId, field, value) => {
    // Keep input as string during editing, only parse when submitting
    setNewMatchResults(prev =>
      prev.map(result =>
        result.team_id === teamId ? { ...result, [field]: value } : result
      )
    );
  };

  const handleSaveMatchResults = async () => {
    try {
      // Validate results before saving
      const validResults = newMatchResults.filter(r => r.position > 0);
      if (validResults.length === 0) {
        alert('Please set positions for at least one team');
        return;
      }

      // Check for duplicate positions
      const positions = validResults.map(r => r.position);
      if (new Set(positions).size !== positions.length) {
        alert('Each team must have a unique position');
        return;
      }

      setSavingMatch(true);

      // Parse string values to integers before sending to server
      const parsedResults = newMatchResults.map(result => ({
        ...result,
        position: parseInt(result.position) || 0,
        kills: parseInt(result.kills) || 0
      }));

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const response = await axios.post(`${backendUrl}/api/save_battle_royale_match_results.php`, {
        tournament_id: tournamentId,
        results: parsedResults
      });

      if (response.data.success) {
        // Refresh leaderboard data
        const leaderboardResponse = await axios.get(`${backendUrl}/api/get_battle_royale_leaderboard.php?tournament_id=${tournamentId}`);

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


  // Replace your existing EditTeamModal with this improved version
  const EditTeamModal = () => {
    if (!showEditModal || !editingTeam) return null;

    const handleTeamStatChange = (field, value) => {
      // Only allow numeric input
      if (value === '' || /^\d+$/.test(value)) {
        setEditingTeam(prev => ({
          ...prev,
          [field]: value
        }));
      }
    };

    // Calculate total for display
    const totalPoints = parseInt(editingTeam.total_kills || 0) + parseInt(editingTeam.total_placement_points || 0);

    return (
      <div className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center backdrop-blur-sm transition-all duration-500 animate-fadeIn">
        <div
          className="bg-gradient-to-b from-secondary to-secondary/70 shadow-2xl w-full max-w-2xl mx-4 overflow-hidden relative "
        >
          {/* Top accent bar with animation */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/15 to-primary animate-shimmer"></div>

          {/* Header with team image background */}
          <div className="relative overflow-hidden">
            {/* Team image background with improved overlay */}
            {editingTeam.image && (
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 bg-cover bg-center z-0 filter blur-sm animate-slowZoom"
                  style={{ backgroundImage: `url(${editingTeam.image})`, opacity: 0.15 }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent"></div>
              </div>
            )}

            <div className="relative z-20 px-6 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 animate-slideInLeft">
                  {/* Team logo/icon */}
                  {editingTeam.logo && (
                    <div className="w-10 h-10 rounded-md overflow-hidden ring-2 ring-white/20 shadow-lg">
                      <img src={editingTeam.logo} alt="Team logo" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Team name with enhanced typography */}
                  <div>
                    <span className="text-xs text-blue-300 uppercase tracking-wider font-mono">Editing Team</span>
                    <h2 className="text-xl font-valorant text-white uppercase tracking-wide leading-tight group-hover:text-blue-300 transition-colors">
                      {editingTeam.team_name}
                    </h2>
                  </div>
                </div>

                {/* Close button with better hover effect */}
                <button
                  onClick={handleEditCancel}
                  className="rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 hover:shadow-inner transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 animate-fadeIn"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main content area with refined spacing */}
          <div className="px-6 py-5">
            {/* Inputs area with improved visual design */}
            <div className="grid grid-cols-2 gap-8 mb-8 px-4">
              {/* Kills Input */}
              <div className="angular-cut p-4 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden shadow-md animate-slideInLeft" style={{ animationDelay: "0.1s" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex flex-col items-center justify-center mb-3 relative z-10">
                  <label className="block text-gray-300 text-2xl uppercase tracking-wider font-free-fire">Kills</label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="kills"
                    value={editingTeam.total_kills || ''}
                    onChange={(e) => handleTeamStatChange('total_kills', e.target.value)}
                    className="w-full bg-gray-900/80 font-ea-football text-white text-center text-4xl px-4 py-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 border-b-2 border-blue-600/50 relative z-10 transition-all"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>

              {/* Class Points Input */}
              <div className="angular-cut p-4 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden shadow-md animate-slideInRight" style={{ animationDelay: "0.2s" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex flex-col items-center justify-between mb-4 relative z-10">
                  <label className="block text-gray-300 text-2xl uppercase tracking-wider font-free-fire">Class Points</label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="classPoints"
                    value={editingTeam.total_placement_points || ''}
                    onChange={(e) => handleTeamStatChange('total_placement_points', e.target.value)}
                    className="w-full bg-gray-900/80 font-ea-football text-white text-center text-4xl px-4 py-6 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 border-b-2 border-purple-600/50 relative z-10 transition-all"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/70 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            </div>

            {/* Total Points with visual impact */}
            <div className="mt-8 text-center bg-gradient-to-b from-gray-800/70 to-secondary/70 py-6 rounded-lg shadow-inner relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 mx-4 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <p className="text-gray-300 text-xl uppercase tracking-wider font-free-fire mb-1">Total Score</p>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary/75 to-primary text-5xl block my-2 animate-pulse">{totalPoints}</span>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary mx-auto mt-3 rounded-full"></div>
            </div>
          </div>

          {/* Footer with improved buttons */}
          <div className="bg-secondary px-6 py-4 flex justify-between border-t border-gray-800 animate-slideInUp" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={handleEditCancel}
              className="text-gray-300 hover:text-white py-2 px-4 rounded-md transition duration-200 flex items-center hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-gray-500/30"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>

            <button
              onClick={handleUpdateTeam}
              className="relative overflow-hidden bg-gradient-to-r from-primary to-primary text-white py-3 px-5 angular-cut shadow-md hover:shadow-lg transition-all duration-200 flex items-center group focus:outline-none"
              type="button"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="relative z-10 font">Update Team</span>
            </button>
          </div>
        </div>
      </div>
    );
  };




  // Replace your existing AdminModal with this improved version
  const AdminModal = () => {
    if (!isAdminModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-dark backdrop-blur-sm z-50 overflow-y-auto animate-fadeIn">
        <div className="container mx-auto p-4 md:p-8 max-w-9xl animate-scaleIn">
          {/* Header */}
          <div className="flex justify-between items-center mb-12 animate-slideInLeft">
            <h2 className="text-5xl md:text-7xl font-custom tracking-wider bg-primary bg-clip-text text-transparent">
              Leaderboard Management
            </h2>
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <X className="text-primary hover:text-white w-6 h-6" />
            </button>
          </div>

          {/* Leaderboard Management Section */}
          <div className="mb-8 animate-slideInUp" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex flex-col md:flex-row w-full md:w-2/4">
                <div className="relative w-full max-w-9xl">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="text-gray-400 w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-800/50 text-white py-3 px-10 angular-cut focus:outline-none focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
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
                    {filteredTeams.length > 0 ? (
                      filteredTeams.map((team, index) => (
                        <tr
                          onClick={() => handleEditClick(team)}
                          key={team.team_id}
                          className="cursor-pointer bg-gray-800/30 hover:bg-gray-700/40 transition-colors duration-200"
                          style={{
                            animation: "fadeIn 0.5s ease forwards",
                            animationDelay: `${0.05 * index}s`
                          }}
                        >
                          <td className="py-4">{index + 1}</td>
                          <td className="py-4">{team.team_name}</td>
                          <td className="py-4 text-center">{team.total_kills}</td>
                          <td className="py-4 text-center">{team.total_placement_points}</td>
                          <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                            <div
                              className={`transition-all text-xl duration-300 ${index < 3 ? 'text-white font-free-fire' : 'text-primary font-free-fire'
                                } text-lg hover:font-bold`}
                            >
                              {team.total_points}
                              <span className="ml-2  font-normal">pts</span>
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
                <div className="mt-3 text-gray-400 text-sm animate-fadeIn" style={{ animationDelay: "0.4s" }}>
                  {searchTerm
                    ? `Found ${filteredTeams.length} team${filteredTeams.length !== 1 ? 's' : ''
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
            <th className="py-3 w-1/12 text-center"></th>
            <th className="py-3 w-1/12 text-left text-base">#</th>
            <th className="py-3 w-3/12 text-left text-base">Team</th>
            <th className="py-3 w-1/12 text-center text-base">Matches</th>
            <th className="py-3 w-2/12 text-center text-base">Kills</th>
            <th className="py-3 w-2/12 text-center text-base">Placement Points</th>
            <th className="py-3 w-2/12 text-center text-base">Total</th>
          </tr>
        </thead>

        {/* Add spacing between thead and tbody */}
        <tr className="h-2 bg-transparent"></tr>

        <tbody className="divide-y-8 divide-gray-800/30">
          {teams.slice(0, 10).map((team, index) => (
            <tr key={team.team_id} className="angular-cut hover:bg-gray-800/30 cursor-pointer relative">
              {/* Background image container */}
              <td colSpan={6} className="absolute inset-0 m-0 p-0 border-none">
                <div className="absolute inset-0 z-0">
                  {/* Team logo or background image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: team.team_image ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${team.team_image})` : '',
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
                  className={`inline-block w-8 h-8 rounded-full ${index === 0
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
                  className={`font-valorant hover:text-primary transition-all duration-300 relative group ${index < 3 ? 'text-white font-bold' : 'text-white'
                    }`}
                >
                  {team.team_name}
                  <span className="absolute -bottom-1 font-base left-0 w-0 h-0.5 bg-primtext-primary group-hover:w-full transition-all duration-300"></span>
                </span>
              </td>

              {/* Matches Played Cell */}
              <td className="py-4 w-1/12 text-center relative z-10 align-middle">
                <div className="transition-all font-base duration-300 hover:font-bold">
                  {team.matches_played}
                </div>
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
                  className={`transition-all duration-300 ${index < 3 ? 'text-white text-xl font-free-fire' : 'text-primary font-free-fire'
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

      {/* Admin Modal */}
      <AdminModal />

      {/* Edit Team Modal */}
      <EditTeamModal />


    </div>
  );
}
export default BattleRoyale;