import React, { useState, useEffect } from 'react';
import { Bracket, Seed, SeedItem } from 'react-brackets';
import { Brackets, ChevronRight, Crown, Loader2, Trophy, Users } from 'lucide-react';

const SingleTournament = ({ tournamentId }) => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredParticipant, setHoveredParticipant] = useState(null);
  const [isTeamTournament, setIsTeamTournament] = useState(true);
  const [tournamentInfo, setTournamentInfo] = useState(null);
  const [champion, setChampion] = useState(null);

  useEffect(() => {
    if (!tournamentId) {
      setError('Tournament ID is required');
      setLoading(false);
      return;
    }

    fetchTournamentData();
  }, [tournamentId]);

  const fetchTournamentData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.gnews.ma/api/fetch_matches_bracket.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournament_id: tournamentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to load tournament data');
      }

      console.log('API Response:', result.data);

      // Set tournament info
      setTournamentInfo(result.data.tournament);
      setIsTeamTournament(result.data.is_team_tournament);

      // Format matches for display
      formatMatches(result.data);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching tournament data:', err);
      setError(err.message || 'Failed to load tournament bracket');
      setLoading(false);
    }
  };

  const formatMatches = (data) => {
    if (!data?.matches?.length) {
      setError(' The bracket will appear here once matches are ready');
      return;
    }

    const totalRounds = data.total_rounds;
    const formattedRounds = [];

    // Sort matches by round and position
    const matchesByRound = {};
    data.matches.forEach((match) => {
      const round = parseInt(match.round);
      if (!matchesByRound[round]) {
        matchesByRound[round] = [];
      }
      matchesByRound[round].push(match);
    });

    // Sort matches by position within each round
    Object.keys(matchesByRound).forEach((round) => {
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
          teams: (
            match.teams || [
              { name: 'TBD', score: 0, winner: false },
              { name: 'TBD', score: 0, winner: false },
            ]
          ).map((team) => ({
            id: team.id || `team-${Math.random()}`,
            name: team.name || 'TBD',
            score: team.score || 0,
            winner: team.winner || false,
            avatar: team.avatar || null,
          })),
        })),
      });
    }

    setRounds(formattedRounds);

    // Find champion (winner of the last round)
    if (formattedRounds.length > 0) {
      const finalRound = formattedRounds[formattedRounds.length - 1];
      if (finalRound.seeds.length > 0) {
        const finalMatch = finalRound.seeds[0];
        const winner = finalMatch.teams.find((team) => team.winner);
        if (winner && winner.name !== 'TBD') {
          setChampion(winner);
        }
      }
    }
  };

  const getRoundTitle = (round, totalRounds) => {
    if (round === totalRounds - 1) return <span className="font-bold text-2xl">Finals</span>;
    if (round === totalRounds - 2) return <span className="font-bold text-2xl">Semi Finals</span>;
    if (round === totalRounds - 3)
      return <span className="font-bold text-2xl">Quarter Finals</span>;
    if (round === totalRounds - 4) return <span className="font-bold text-2xl">Round of 16</span>;
    if (round === totalRounds - 5) return <span className="font-bold text-2xl">Round of 32</span>;
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
                  {/* Avatar or Initial */}
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center shrink-0 overflow-hidden
                      ${
                        team.winner
                          ? 'bg-gradient-to-br from-violet-500 to-violet-600 ring-1 ring-violet-500'
                          : 'bg-gray-700'
                      }
                    `}
                  >
                    {team.avatar ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.avatar}`}
                        alt={team.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className={`
                          text-xs
                          ${team.winner ? 'text-white' : 'text-gray-400'}
                        `}
                      >
                        {isTBD(team) ? '?' : team.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Team Name */}
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

                  {/* Score */}
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
    <div className="min-h-screen w-full  p-4">
      <div className="max-w-6xl mx-auto">
        <div className="w-full h-full rounded-xl p-4 shadow-lg">
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading tournament bracket...</span>
            </div>
          ) : error ? (
            <div className="relative max-w-md mx-auto my-12">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>

              <div className="bg-black/40 border border-white/10 p-8 text-center">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 transform -skew-x-6">
                    <Brackets className="text-primary w-8 h-8 transform skew-x-6" />
                  </div>

                  <h3 className="text-xl font-zentry text-white mb-3 uppercase tracking-wider">
                    {error}
                  </h3>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-px w-8 bg-primary"></div>
                    <div className="h-1 w-1 bg-primary transform rotate-45"></div>
                    <div className="h-px w-8 bg-primary"></div>
                  </div>
                </div>
              </div>
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
