import React, { useState, useEffect } from 'react';
import { Bracket, Seed, SeedItem } from 'react-brackets';
import { ChevronRight, Crown, Loader2, Trophy } from 'lucide-react';

const SingleTournament = () => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredParticipant, setHoveredParticipant] = useState(null);
  const [isTeamTournament, setIsTeamTournament] = useState(true);

  useEffect(() => {
    // Simulate API fetch with realistic data
    setTimeout(() => {
      try {
        const mockData = generateMockTournamentData();
        formatMatches(mockData);
        setIsTeamTournament(mockData.is_team_tournament);
        setLoading(false);
      } catch (err) {
        console.error('Error loading tournament data:', err);
        setError('Failed to load tournament bracket');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const generateMockTournamentData = () => {
    // Create a realistic 8-team tournament (3 rounds)
    const teams = [
      { id: 1, name: 'Phoenix Flames', avatar: null },
      { id: 2, name: 'Arctic Wolves', avatar: null },
      { id: 3, name: 'Thunder Dragons', avatar: null },
      { id: 4, name: 'Royal Knights', avatar: null },
      { id: 5, name: 'Shadow Hawks', avatar: null },
      { id: 6, name: 'Cosmic Stars', avatar: null },
      { id: 7, name: 'Storm Giants', avatar: null },
      { id: 8, name: 'Golden Eagles', avatar: null }
    ];
    
    // Round 1 (Quarter Finals) - All matches completed
    const round1 = [
      {
        id: 'match-1',
        round: 1,
        position: 1,
        status: 'SCORE_DONE',
        teams: [
          { ...teams[0], score: 3, winner: true },
          { ...teams[1], score: 1, winner: false }
        ]
      },
      {
        id: 'match-2',
        round: 1,
        position: 2,
        status: 'SCORE_DONE',
        teams: [
          { ...teams[2], score: 2, winner: true },
          { ...teams[3], score: 0, winner: false }
        ]
      },
      {
        id: 'match-3',
        round: 1,
        position: 3,
        status: 'SCORE_DONE',
        teams: [
          { ...teams[4], score: 1, winner: false },
          { ...teams[5], score: 2, winner: true }
        ]
      },
      {
        id: 'match-4',
        round: 1,
        position: 4,
        status: 'SCORE_DONE',
        teams: [
          { ...teams[6], score: 0, winner: false },
          { ...teams[7], score: 3, winner: true }
        ]
      }
    ];
    
    // Round 2 (Semi Finals) - One match completed, one scheduled
    const round2 = [
      {
        id: 'match-5',
        round: 2,
        position: 1,
        status: 'SCORE_DONE',
        teams: [
          { ...teams[0], score: 2, winner: false },
          { ...teams[2], score: 3, winner: true }
        ]
      },
      {
        id: 'match-6',
        round: 2,
        position: 2,
        status: 'SCORE_DONE',
        teams: [
          { ...teams[5], score: 1, winner: false },
          { ...teams[7], score: 2, winner: true }
        ]
      }
    ];
    
    // Round 3 (Finals) - Match completed
    const round3 = [
      {
        id: 'match-7',
        round: 3,
        position: 1,
        status: 'SCORE_DONE',
        teams: [
          { ...teams[2], score: 4, winner: true },
          { ...teams[7], score: 2, winner: false }
        ]
      }
    ];
    
    return {
      total_rounds: 3,
      is_team_tournament: true,
      matches: [...round1, ...round2, ...round3]
    };
  };

  const formatMatches = (data) => {
    if (!data?.matches?.length) {
      setError('The bracket is not implemented yet');
      return;
    }

    const totalRounds = data.total_rounds;
    const formattedRounds = [];

    // Sort matches by position within each round
    const matchesByRound = {};
    data.matches.forEach(match => {
      const round = parseInt(match.round);
      if (!matchesByRound[round]) {
        matchesByRound[round] = [];
      }
      matchesByRound[round].push(match);
    });

    // Sort matches by position within each round
    Object.keys(matchesByRound).forEach(round => {
      matchesByRound[round].sort((a, b) => parseInt(a.position) - parseInt(b.position));
    });

    for (let round = 0; round < totalRounds; round++) {
      const roundNumber = round + 1;
      const roundMatches = matchesByRound[roundNumber] || [];
      const expectedMatches = Math.pow(2, totalRounds - round - 1);

      // Fill in any missing matches with TBD
      while (roundMatches.length < expectedMatches) {
        roundMatches.push({
          id: `empty-${round}-${roundMatches.length}`,
          status: 'SCHEDULED',
          position: roundMatches.length,
          teams: [
            { name: 'TBD', score: 0, winner: false },
            { name: 'TBD', score: 0, winner: false },
          ],
        });
      }

      formattedRounds.push({
        title: getRoundTitle(round, totalRounds),
        seeds: roundMatches.map((match) => ({
          id: match.id,
          status: match.status,
          teams: (match.teams || [
            { name: 'TBD', score: 0, winner: false },
            { name: 'TBD', score: 0, winner: false },
          ]).map((team) => ({
            ...team,
            id: team.id || `team-${Math.random()}`,
          })),
        })),
      });
    }

    setRounds(formattedRounds);
  };

  const getRoundTitle = (round, totalRounds) => {
    if (round === totalRounds - 1) return <span className="font-bold text-2xl">Finals</span>;
    if (round === totalRounds - 2)
      return <span className="font-bold text-2xl">Semi Finals</span>;
    if (round === totalRounds - 3)
      return <span className="font-bold text-2xl">Quarter Finals</span>;
    if (round === totalRounds - 4)
      return <span className="font-bold text-2xl">Round of 16</span>;
    if (round === totalRounds - 5)
      return <span className="font-bold text-2xl">Round of 32</span>;
    return `Round ${round + 1}`;
  };

  const CustomSeed = ({ seed, roundIndex, seedIndex }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isTBD = (team) => !team.name || team.name === 'TBD';
    const isPartOfJourney =
      hoveredParticipant && seed.teams.some((team) => team.name === hoveredParticipant);
    
    return (
      <Seed>
        <SeedItem>
          <div
            className="relative w-full max-w-xs"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {seed.teams.map((team, idx) => (
              <div
                key={team.id}
                className={`
                  relative mb-1 last:mb-0 transition-all duration-300 ease-in-out
                  ${team.winner ? 'z-10' : 'z-0'}
                `}
                onMouseEnter={() => !isTBD(team) && setHoveredParticipant(team.name)}
                onMouseLeave={() => setHoveredParticipant(null)}
              >
                <div
                  className={`
                    flex items-center px-3 py-2 rounded
                    ${team.winner ? 'border-l-2 border-l-violet-500' : ''}
                    ${!isTBD(team) && seed.status !== 'SCORE_DONE' ? 'cursor-pointer' : ''}
                    ${
                      team.name === hoveredParticipant
                        ? 'bg-blue-500/30'
                        : isTBD(team)
                        ? 'bg-gray-800/50'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }
                    relative
                  `}
                >
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center shrink-0
                      ${
                        team.winner
                          ? 'bg-gradient-to-br from-violet-500 to-violet-600 ring-1 ring-violet-500'
                          : 'bg-gray-700'
                      }
                    `}
                  >
                    <span
                      className={`
                        text-xs
                        ${team.winner ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      {isTBD(team) ? '?' : team.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0 flex-1 ml-2">
                    <span
                      className={`
                        text-sm truncate flex-1
                        ${team.winner ? 'text-white font-medium' : 'text-gray-300'}
                        ${isTBD(team) ? 'italic text-gray-500' : ''}
                        ${isHovered && !isTBD(team) ? 'text-gray-200' : ''}
                      `}
                    >
                      {team.name}
                    </span>
                    {team.winner && !isTBD(team) && (
                      <Crown
                        size={14}
                        className={`
                          shrink-0
                          ${isHovered ? 'text-yellow-400' : 'text-yellow-500'}
                        `}
                      />
                    )}
                  </div>
                  <span
                    className={`
                      text-sm min-w-[20px] text-right ml-2 font-medium
                      ${team.winner ? 'text-white' : 'text-gray-300'}
                      ${isHovered && !isTBD(team) ? 'text-gray-300' : ''}
                    `}
                  >
                    {team.score || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Championship Banner - only for finals winner */}
          {seed.teams.some((team) => team.winner) &&
            getRoundTitle(roundIndex, rounds.length).props?.children === 'Finals' && (
              <div className="mt-4 relative group">
                <div
                  className="absolute -left-2 -right-2 h-14 bg-gradient-to-r from-yellow-600 to-amber-500 
                    shadow-lg transform hover:scale-105 transition-all duration-300
                    flex items-center justify-between px-4 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Trophy
                      size={18}
                      className="text-white group-hover:rotate-12 transition-transform duration-300"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-medium uppercase tracking-wider">
                        Tournament
                      </span>
                      <span className="text-white text-sm font-bold">Champion</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-yellow-100 text-xs">Winner</span>
                      <span className="text-white text-sm font-bold">
                        {seed.teams.find((team) => team.winner)?.name}
                      </span>
                    </div>
                    <Crown size={18} className="text-white" />
                  </div>
                </div>
              </div>
            )}
        </SeedItem>
      </Seed>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Tournament Championship 2025</h1>
        
        <div className="w-full h-full rounded-xl bg-gray-900 p-4 shadow-lg">
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading tournament bracket...</span>
            </div>
          ) : error ? (
            <div className="min-h-[400px] flex items-center justify-center text-gray-400">
              {error}
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-8">
              <Bracket
                rounds={rounds}
                renderSeedComponent={(props) => (
                  <CustomSeed
                    key={`${props.seedIndex}-${props.roundIndex}`}
                    {...props}
                    hoveredParticipant={hoveredParticipant}
                    setHoveredParticipant={setHoveredParticipant}
                  />
                )}
                roundClassName="flex-none"
                lineColor={hoveredParticipant ? 'rgba(75, 85, 99, 0.5)' : 'rgba(75, 85, 99, 0.2)'}
                lineWidth={2}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleTournament;