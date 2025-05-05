import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaUserFriends, FaRegClock, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

// Main PlayoffsBracket component
const PlayoffsBracket = ({ bracketData, tournamentId, onSaveResult = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMatchId, setEditMatchId] = useState(null);
  const [editScores, setEditScores] = useState({ score1: 0, score2: 0 });
  
  // If we're passed bracketData directly, use it, otherwise we'd fetch it
  const [rounds, setRounds] = useState(bracketData?.rounds || []);
  
  // Fetch playoff data if not provided
  useEffect(() => {
    if (bracketData) {
      setRounds(bracketData.rounds);
      return;
    }
    
    if (tournamentId) {
      fetchPlayoffData();
    }
  }, [bracketData, tournamentId]);
  
  // Function to fetch playoff data from backend
  const fetchPlayoffData = async () => {
    if (!tournamentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_playoffs.php?tournament_id=${tournamentId}`
      );
      
      if (response.data.success && response.data.data.has_playoffs) {
        setRounds(response.data.data.bracket.rounds);
      } else {
        setError('No playoff data available');
      }
    } catch (err) {
      console.error('Error fetching playoff data:', err);
      setError('Failed to load playoff data');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle editing a match
  const handleEditMatch = (match) => {
    setEditMatchId(match.id);
    setEditScores({
      score1: match.score1 || 0,
      score2: match.score2 || 0
    });
  };
  
  // Helper to update a specific match within the rounds data structure
  const updateMatchInRounds = (matchId, updatedData) => {
    return rounds.map(round => {
      const updatedRound = round.map(match => {
        if (match.id === matchId) {
          // Return updated match
          return {
            ...match,
            ...updatedData,
            // Update participants with winner information
            participants: match.participants ? match.participants.map((participant, index) => {
              const isWinner = 
                (updatedData.score1 > updatedData.score2 && index === 0) || 
                (updatedData.score2 > updatedData.score1 && index === 1);
              
              return {
                ...participant,
                is_winner: isWinner,
                result_text: `${index === 0 ? updatedData.score1 : updatedData.score2}-${index === 0 ? updatedData.score2 : updatedData.score1}`
              };
            }) : []
          };
        }
        return match;
      });
      return updatedRound;
    });
  };
  
  // Handle saving a match result
  const handleSaveResult = async (match) => {
    setLoading(true);
    
    try {
      // First update the UI immediately with optimistic update
      const updatedData = {
        score1: editScores.score1,
        score2: editScores.score2,
        state: 'SCORE_DONE'
      };
      
      // Update the local state immediately
      setRounds(updateMatchInRounds(match.id, updatedData));
      
      // Call API to update match result
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_playoff_match.php?match_id=${match.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            team1_score: editScores.score1,
            team2_score: editScores.score2
          })
        }
      );
      const data = await response.json();
      
      if (data.success) {
        console.log('Match updated successfully:', data);
        
        // After a short delay, fetch the full updated bracket
        // This ensures any team advancements are reflected
        setTimeout(() => {
          fetchPlayoffData();
        }, 1000);
        
        // Call parent callback if needed
        onSaveResult({
          matchId: match.id,
          ...editScores
        });
      } else {
        setError('Failed to save match result');
        // Revert optimistic update if the API call failed
        fetchPlayoffData();
      }
    } catch (err) {
      console.error('Error updating match result:', err);
      setError('Error updating match result');
      // Revert optimistic update if there was an error
      fetchPlayoffData();
    } finally {
      setLoading(false);
      setEditMatchId(null);
    }
  };
  
  const cancelEdit = () => {
    setEditMatchId(null);
  };
  
  // Loading state
  if (loading && !rounds.length) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-gray-900/30 rounded-lg border border-gray-800">
        <div className="text-center">
          <FaSpinner className="mx-auto text-4xl text-primary/50 mb-4 animate-spin" />
          <p className="text-gray-400">Loading playoff bracket...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error && !rounds.length) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-gray-900/30 rounded-lg border border-gray-800">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-400">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            onClick={fetchPlayoffData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // No data state
  if (!rounds || rounds.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-gray-900/30 rounded-lg border border-gray-800">
        <div className="text-center">
          <FaTrophy className="mx-auto text-4xl text-primary/50 mb-4" />
          <p className="text-gray-400">Waiting for group stage to complete...</p>
          <p className="text-sm text-gray-500 mt-2">Top 2 teams from each group will advance to playoffs</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-6">
        <div className="flex min-w-max space-x-8 p-4">
          {rounds.map((round, roundIndex) => (
            <div 
              key={`round-${roundIndex}`} 
              className="flex flex-col justify-around"
              style={{ minHeight: round.length * 180 + (round.length - 1) * 40 }}
            >
              <div className="mb-4 text-center">
                <span className="px-4 py-1 rounded-full bg-gray-800 text-primary text-sm font-bold">
                  {roundIndex === 0 
                    ? "Final" 
                    : roundIndex === 1 
                      ? "Semi-Finals" 
                      : roundIndex === 2 
                        ? "Quarter-Finals"
                        : `Round ${rounds.length - roundIndex}`}
                </span>
              </div>
              
              <div className="flex flex-col justify-around h-full">
                {round.map((match, matchIndex) => (
                  <BracketMatch
                    key={match.id}
                    match={match}
                    isEditing={editMatchId === match.id}
                    editScores={editScores}
                    setEditScores={setEditScores}
                    onEdit={() => handleEditMatch(match)}
                    onSave={() => handleSaveResult(match)}
                    onCancel={cancelEdit}
                    isFinal={roundIndex === 0}
                    hasParticipants={match.participants && match.participants.length > 0}
                    isUpdating={loading && editMatchId === match.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Match card component for bracket visualization
const BracketMatch = ({ 
  match, 
  isEditing, 
  editScores, 
  setEditScores, 
  onEdit, 
  onSave, 
  onCancel,
  isFinal,
  hasParticipants,
  isUpdating
}) => {
  // Helper for background styling
  const getBackgroundStyle = (team) => {
    if (!team) return {};
    
    return {
      backgroundImage: team.teamImage ? `url(${team.teamImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.2,
    };
  };
  
  const getWinner = () => {
    if (!match.participants || match.participants.length === 0) return null;
    
    // Check if there's a participant marked as winner
    const winner = match.participants.find(p => p.is_winner);
    if (winner) return winner;
    
    // Or use scores to determine winner
    if (match.score1 !== undefined && match.score2 !== undefined) {
      if (match.score1 > match.score2 && match.participants[0]) {
        return match.participants[0];
      } else if (match.score2 > match.score1 && match.participants[1]) {
        return match.participants[1];
      }
    }
    
    return null;
  };
  
  const winner = getWinner();
  
  // Handle score changes
  const handleScoreChange = (team, value) => {
    if (isEditing) {
      setEditScores(prev => ({
        ...prev,
        [team]: Math.max(0, parseInt(value) || 0)
      }));
    }
  };
  
  return (
    <motion.div 
      className="w-64 h-auto rounded-lg overflow-hidden relative mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Highlight for final match */}
      {isFinal && (
        <motion.div 
          className="absolute inset-0  rounded-lg pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0 rgba(234, 179, 8, 0)',
              '0 0 8px rgba(234, 179, 8, 0.6)',
              '0 0 0 rgba(234, 179, 8, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    
      {/* Champion badge for final winner */}
      {isFinal && winner && (
        <div className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-2 z-10 shadow-lg">
          <FaTrophy className="text-gray-900" />
        </div>
      )}
      
      {/* Match content */}
      <div className="p-3">
        {/* Match header */}
       
        
        {/* Teams */}
        <div className="space-y-2">
          {/* Team 1 */}
          <div className={`relative rounded-md overflow-hidden transition-all ${
            winner && match.participants?.[0]?.id === winner.id ? 'border-l-4 border-green-500' : ''
          }`}>
            <div className="absolute inset-0 z-0">
              {match.participants?.[0]?.picture && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${match.participants[0].picture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.2,
                  }}
                ></div>
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
                }}
              ></div>
            </div>
            
            <div className="p-2 flex justify-between items-center relative z-10">
              <div className="flex items-center">
                {match.participants?.[0]?.picture && (
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${match.participants[0].picture}`} 
                      alt={match.participants[0].name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div>
                  <div className={`font-valorant ${match.participants?.[0] ? 'text-white' : 'text-gray-500'}`}>
                    {match.participants?.[0]?.name || "To Be Determined"}
                  </div>
                </div>
              </div>
              
              <div className="w-10 text-center">
               
                  <span className="text-xl font-bold text-primary">
                    {match.score1 !== null && match.score1 !== undefined ? match.score1 : "-"}
                  </span>
                
              </div>
            </div>
          </div>
          
          {/* Versus divider */}
          <div className="flex items-center justify-center">
            <div className="h-px flex-grow bg-gray-800"></div>
            <span className="px-2 text-gray-500 text-xs">VS</span>
            <div className="h-px flex-grow bg-gray-800"></div>
          </div>
          
          {/* Team 2 */}
          <div className={`relative rounded-md overflow-hidden transition-all ${
            winner && match.participants?.[1]?.id === winner.id ? 'border-l-4 border-green-500' : ''
          }`}>
            <div className="absolute inset-0 z-0">
              {match.participants?.[1]?.picture && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${match.participants[1].picture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.2,
                  }}
                ></div>
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
                }}
              ></div>
            </div>
            
            <div className="p-2 flex justify-between items-center relative z-10">
              <div className="flex items-center">
                {match.participants?.[1]?.picture && (
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${match.participants[1].picture}`} 
                      alt={match.participants[1].name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div>
                  <div className={`font-valorant ${match.participants?.[1] ? 'text-white' : 'text-gray-500'}`}>
                    {match.participants?.[1]?.name || "To Be Determined"}
                  </div>
                </div>
              </div>
              
              <div className="w-10 text-center">
                
                  <span className="text-xl font-bold text-primary">
                    {match.score2 !== null && match.score2 !== undefined ? match.score2 : "-"}
                  </span>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Match bottom info */}
    
      
      {/* Connector lines for bracket visualization */}
      {match.nextMatchId && (
        <div className="absolute right-0 top-1/2 w-8 border-t-2 border-gray-700"></div>
      )}
      
      {/* Loading overlay when updating */}
      {isUpdating && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <FaSpinner className="animate-spin text-2xl text-primary" />
        </div>
      )}
    </motion.div>
  );
};

export default PlayoffsBracket;
