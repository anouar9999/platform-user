import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, Trophy, Shield, UserCircle, Users, PlusCircle } from 'lucide-react';
import Image from 'next/image';

// ============================================
// MOCK DATA - Set to true to use mock data
// ============================================
const USE_MOCK_DATA = true;

const MOCK_PARTICIPANTS = [
  {
    registration_id: 1,
    type: 'player',
    username: 'ShadowStrike',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
  },
  {
    registration_id: 2,
    type: 'team',
    team_name: 'Cyber Warriors',
    team_avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&h=150&fit=crop',
    division: 'Gold 3',
    total_members: 5,
  },
  {
    registration_id: 3,
    type: 'player',
    username: 'NightHawk',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    registration_id: 4,
    type: 'team',
    team_name: 'Phoenix Squad',
    team_avatar: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=150&h=150&fit=crop',
    division: 'Platinum 2',
    total_members: 6,
  },
  {
    registration_id: 5,
    type: 'player',
    username: 'VortexGaming',
    avatar: null, // Test default avatar
  },
  {
    registration_id: 6,
    type: 'team',
    team_name: 'Elite Forces',
    team_avatar: null, // Test default avatar
    division: 'Diamond 1',
    total_members: 4,
  },
  {
    registration_id: 7,
    type: 'player',
    username: 'ThunderBolt',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    registration_id: 8,
    type: 'team',
    team_name: 'Iron Legends',
    team_avatar:
      'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&h=150&fit=crop',
    division: 'Silver 2',
    total_members: 7,
  },
  {
    registration_id: 9,
    type: 'player',
    username: 'BlazeFury',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
  },
  {
    registration_id: 10,
    type: 'team',
    team_name: 'Dark Stalkers',
    team_avatar:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop',
    division: 'Master',
    total_members: 8,
  },
];
// ============================================

const DefaultAvatar = ({ isTeam }) => (
  <div className="relative w-full h-full bg-black/60">
    {/* Scanline effect */}
    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.03)_2px,rgba(255,61,8,0.03)_4px)]" />

    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,61,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,61,8,0.3) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    />

    {/* Icon */}
    <div className="absolute inset-0 flex items-center justify-center">
      {isTeam ? (
        <Shield className="w-8 h-8 md:w-12 md:h-12 text-primary/50" strokeWidth={1.5} />
      ) : (
        <UserCircle className="w-8 h-8 md:w-12 md:h-12 text-primary/50" strokeWidth={1.5} />
      )}
    </div>

    {/* Bottom gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
  </div>
);

const ParticipantOrTeamCard = ({ item }) => {
  const isTeam = item.type === 'team';
  const isCurrentUser = !isTeam && localStorage.getItem('username') === item.username;
  const avatarSrc = isTeam
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.team_avatar}`
    : item.avatar;

  return (
    <div className="group relative">
      {/* Corner accents */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>

      {/* Main card */}
      <div className="relative bg-black/40 border border-white/10 group-hover:border-primary/50 overflow-hidden transition-all duration-300 h-full">
        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50 pointer-events-none"></div>

        {/* Avatar section */}
        <div className="relative h-20 sm:h-24 md:h-28 overflow-hidden">
          {avatarSrc && !USE_MOCK_DATA ? (
            <img
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500"
              src={avatarSrc}
              alt={`${isTeam ? item.team_name : item.username}'s avatar`}
              width={192}
              height={128}
            />
          ) : avatarSrc && USE_MOCK_DATA && avatarSrc !== null ? (
            <img
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500"
              src={avatarSrc}
              alt={`${isTeam ? item.team_name : item.username}'s avatar`}
              width={192}
              height={128}
            />
          ) : (
            <DefaultAvatar isTeam={isTeam} />
          )}

          {/* Vignette effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.8))]" />

          {/* Current user badge */}
          {isCurrentUser && (
            <div className="absolute top-2 right-2 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-sm"></div>
                <div className="relative bg-primary text-black text-xs font-bold px-3 py-1 transform -skew-x-6 border border-primary/50">
                  <span className="transform skew-x-6 block">YOU</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="relative ">
          {/* Name with side accent */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary"></div>
            <h5 className="text-sm sm:text-base md:text-xl font-zentry text-white truncate uppercase tracking-wide">
              {isTeam ? item.team_name : item.username}
            </h5>
          </div>

          {/* Team-specific content */}
        </div>

        {/* Bottom accent line */}
      </div>
    </div>
  );
};

const ParticipantCardGrid = ({ tournamentId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournamentType, setTournamentType] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        setTimeout(() => {
          setParticipants(MOCK_PARTICIPANTS);
          setTournamentType('mixed');
          setLoading(false);
        }, 1000); // Simulate API delay
        return;
      }

      // Real API call
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_accepted_participants.php?tournament_id=${tournamentId}`,
        );
        if (response.data.success) {
          setParticipants(response.data.participants);
          setTournamentType(response.data.tournament_type);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch participants. Please try again later.');
        console.error('Error fetching participants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        {/* Loading spinner with tech styling */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-2 border-primary/20 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative border-l-4 border-red-500 bg-black/40 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 border border-red-500/40 flex items-center justify-center transform -skew-x-6">
            <HelpCircle className="w-5 h-5 text-red-500 transform skew-x-6" />
          </div>
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
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
            <div className="w-16 h-16 bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4 transform -skew-x-6">
              <Users className="text-primary w-8 h-8 transform skew-x-6" />
            </div>

            <h3 className="text-xl font-valorant text-white mb-3 uppercase tracking-wider">
              No Participants Yet
            </h3>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-primary"></div>
              <div className="h-1 w-1 bg-primary transform rotate-45"></div>
              <div className="h-px w-8 bg-primary"></div>
            </div>

            <p className="text-gray-400 font-mono text-sm uppercase tracking-wide">
              Be the first to join
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 sm:px-4">
      {/* Mock data indicator */}
      {USE_MOCK_DATA && (
        <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 p-3 text-center">
          <p className="text-yellow-500 text-sm font-mono uppercase tracking-wider">
            ⚠ Using Mock Data - Set USE_MOCK_DATA to false for real data
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {participants.map((item) => (
          <ParticipantOrTeamCard key={`participant-${item.registration_id}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantCardGrid;
