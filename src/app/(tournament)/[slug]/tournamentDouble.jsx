import React, { useState, useEffect } from 'react';
import { ChevronRight, Crown, Trophy } from 'lucide-react';

const DoubleEliminationBracket = () => {
  const [hoveredTeam, setHoveredTeam] = useState(null);

  // Sample teams for the tournament
  const teams = [
    { id: 1, name: "WINNERS ESPORTS", seed: 1 },
    { id: 2, name: "JOKO FORCE", seed: 2 },
    { id: 3, name: "Old School", seed: 3 },
    { id: 4, name: "Amateras", seed: 4 },
    { id: 5, name: "Tyranids", seed: 5 },
    { id: 6, name: "FANTASMAjr", seed: 6 },
    { id: 7, name: "TOXIC TX", seed: 7 },
    { id: 8, name: "TripleX.Team", seed: 8 }
  ];

  // Create brackets with realistic match data
  const winnersBracket = [
    // Round 1 (Quarterfinals)
    [
      {
        id: 'w1',
        teams: [
          { ...teams[0], score: 3, winner: true },
          { ...teams[7], score: 1, winner: false }
        ]
      },
      {
        id: 'w2',
        teams: [
          { ...teams[3], score: 2, winner: true },
          { ...teams[4], score: 0, winner: false }
        ]
      },
      {
        id: 'w3',
        teams: [
          { ...teams[1], score: 3, winner: true },
          { ...teams[6], score: 1, winner: false }
        ]
      },
      {
        id: 'w4',
        teams: [
          { ...teams[2], score: 0, winner: false },
          { ...teams[5], score: 2, winner: true }
        ]
      }
    ],
    // Round 2 (Semifinals)
    [
      {
        id: 'w5',
        teams: [
          { ...teams[0], score: 3, winner: true },
          { ...teams[3], score: 1, winner: false }
        ]
      },
      {
        id: 'w6',
        teams: [
          { ...teams[1], score: 2, winner: false },
          { ...teams[5], score: 3, winner: true }
        ]
      }
    ],
    // Winners Final
    [
      {
        id: 'w7',
        teams: [
          { ...teams[0], score: 3, winner: true },
          { ...teams[5], score: 2, winner: false }
        ]
      }
    ]
  ];

  const losersBracket = [
    // Round 1
    [
      {
        id: 'l1',
        teams: [
          { ...teams[7], score: 0, winner: false },
          { ...teams[4], score: 2, winner: true }
        ]
      },
      {
        id: 'l2',
        teams: [
          { ...teams[6], score: 3, winner: true },
          { ...teams[2], score: 1, winner: false }
        ]
      }
    ],
    // Round 2
    [
      {
        id: 'l3',
        teams: [
          { ...teams[3], score: 1, winner: false },
          { ...teams[4], score: 2, winner: true }
        ]
      },
      {
        id: 'l4',
        teams: [
          { ...teams[1], score: 3, winner: true },
          { ...teams[6], score: 2, winner: false }
        ]
      }
    ],
    // Round 3 (Losers Semifinal)
    [
      {
        id: 'l5',
        teams: [
          { ...teams[4], score: 1, winner: false },
          { ...teams[1], score: 3, winner: true }
        ]
      }
    ],
    // Losers Final
    [
      {
        id: 'l6',
        teams: [
          { ...teams[5], score: 2, winner: false },
          { ...teams[1], score: 3, winner: true }
        ]
      }
    ]
  ];

  // Grand Finals
  const grandFinals = [
    {
      id: 'gf1',
      teams: [
        { ...teams[0], score: 2, winner: false },
        { ...teams[1], score: 3, winner: true }
      ]
    },
    {
      id: 'gf2',
      teams: [
        { ...teams[0], score: 1, winner: false },
        { ...teams[1], score: 3, winner: true, champion: true }
      ],
      isBracketReset: true
    }
  ];

  const TeamMatchup = ({ match, isGrandFinals = false, isBracketReset = false }) => {
    return (
      <div className={`w-full max-w-xs mb-4 ${isGrandFinals ? 'border-l-4 border-yellow-500' : ''}`}>
        <div className="text-xs text-gray-400 mb-1">
          {isGrandFinals ? (isBracketReset ? 'Grand Finals (Reset)' : 'Grand Finals') : 'Match'}
        </div>
        <div className="bg-gray-800 rounded overflow-hidden">
          {match.teams.map((team, idx) => (
            <div
              key={`${match.id}-${team.id}`}
              className={`relative ${idx === 0 ? 'border-b border-gray-700' : ''}`}
              onMouseEnter={() => setHoveredTeam(team.name)}
              onMouseLeave={() => setHoveredTeam(null)}
            >
              <div
                className={`
                  flex items-center px-3 py-2
                  ${team.winner ? 'bg-gray-700' : 'bg-gray-800'}
                  ${hoveredTeam === team.name ? 'bg-blue-900/30' : ''}
                  ${team.champion ? 'bg-gradient-to-r from-yellow-700/50 to-yellow-600/30' : ''}
                  transition-colors duration-200
                `}
              >
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center shrink-0
                    ${team.winner ? 'bg-blue-600' : 'bg-gray-700'}
                    ${team.champion ? 'bg-yellow-500' : ''}
                  `}
                >
                  <span className="text-xs text-white font-medium">{team.seed}</span>
                </div>
                
                <div className="ml-2 flex-1 flex items-center justify-between">
                  <span className={`
                    text-sm font-medium
                    ${team.winner ? 'text-white' : 'text-gray-400'}
                    ${team.champion ? 'text-yellow-200' : ''}
                  `}>
                    {team.name}
                  </span>
                  
                  <div className="flex items-center">
                    <span className={`
                      text-sm font-bold
                      ${team.winner ? 'text-white' : 'text-gray-400'}
                      ${team.champion ? 'text-yellow-200' : ''}
                    `}>
                      {team.score}
                    </span>
                    
                    {team.winner && (
                      <ChevronRight size={16} className="ml-1 text-blue-400" />
                    )}
                    
                    {team.champion && (
                      <Crown size={14} className="ml-1 text-yellow-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Double Elimination Tournament</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 overflow-x-auto">
        {/* Winners Bracket */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Winners Bracket</h2>
          <div className="flex gap-12 overflow-x-auto pb-4">
            {winnersBracket.map((round, roundIdx) => (
              <div key={`winners-round-${roundIdx}`} className="flex-none">
                <h3 className="text-lg font-medium mb-4 text-gray-300">
                  {roundIdx === 0 ? 'Quarterfinals' : 
                   roundIdx === 1 ? 'Semifinals' : 'Winners Final'}
                </h3>
                <div className="space-y-8">
                  {round.map(match => (
                    <TeamMatchup key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Grand Finals */}
        <div className="lg:order-3">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">Grand Finals</h2>
          <div className="space-y-6">
            {grandFinals.map((match, idx) => (
              <TeamMatchup 
                key={match.id} 
                match={match} 
                isGrandFinals={true} 
                isBracketReset={match.isBracketReset}
              />
            ))}
            
            {/* Champion Banner */}
            {grandFinals[1].teams.find(t => t.champion) && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-800/50 to-yellow-600/30 rounded-lg border border-yellow-600/50">
                <div className="flex items-center">
                  <Trophy size={24} className="text-yellow-400 mr-3" />
                  <div>
                    <div className="text-xs text-yellow-400 uppercase tracking-wider">Tournament Champion</div>
                    <div className="text-lg font-bold text-white">
                      {grandFinals[1].teams.find(t => t.champion).name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Losers Bracket */}
        <div className="flex-1 lg:order-2">
          <h2 className="text-xl font-bold mb-4 text-red-400">Losers Bracket</h2>
          <div className="flex gap-12 overflow-x-auto pb-4">
            {losersBracket.map((round, roundIdx) => (
              <div key={`losers-round-${roundIdx}`} className="flex-none">
                <h3 className="text-lg font-medium mb-4 text-gray-300">
                  {roundIdx === 0 ? 'Round 1' : 
                   roundIdx === 1 ? 'Round 2' : 
                   roundIdx === 2 ? 'Semifinal' : 'Losers Final'}
                </h3>
                <div className="space-y-8">
                  {round.map(match => (
                    <TeamMatchup key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-12 text-sm text-gray-400 space-y-1">
        <p>* Winners bracket teams must be defeated twice to be eliminated</p>
        <p>* Grand Finals may require a bracket reset if the Winners bracket champion loses the first series</p>
        <p>* JOKO FORCE came from the losers bracket to win the tournament</p>
      </div>
    </div>
  );
};

export default DoubleEliminationBracket;