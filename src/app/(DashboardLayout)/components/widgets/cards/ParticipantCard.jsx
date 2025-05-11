import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, Trophy, Shield, UserCircle, Users, PlusCircle } from 'lucide-react';
import Image from 'next/image';

const DefaultAvatar = ({ isTeam }) => (
  <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-900 to-gray-900" />
    {isTeam ? (
      <Shield
        className="w-6 h-6 xs:w-8 xs:h-8 md:w-10 md:h-10 text-gray-400 relative z-10"
        strokeWidth={1.5}
      />
    ) : (
      <UserCircle
        className="w-6 h-6 xs:w-8 xs:h-8 md:w-10 md:h-10 text-gray-400 relative z-10"
        strokeWidth={1.5}
      />
    )}
    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
  </div>
);

const ParticipantOrTeamCard = ({ item }) => {
  console.log(item)
  const isTeam = item.type === 'team';
  const isCurrentUser = !isTeam && localStorage.getItem('username') === item.username;
  const avatarSrc = isTeam
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.team_avatar}`
    : item.avatar;

  return (
    <div
      className="group relative bg-dark/80 overflow-hidden rounded-lg border border-gray-800/50
      hover:border-primary/30 transition-all duration-300 h-full transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Animated glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 
        opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-1000 group-hover:animate-glow"></div>
      
      {/* Card content with improved styling */}
      <div className="relative z-10">
        {/* Avatar section with better gradient overlay */}
        <div className="relative h-16 xs:h-20 sm:h-24 overflow-hidden">
          {avatarSrc ? (
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${avatarSrc}`}
              alt={`${isTeam ? item.team_name : item.username}'s avatar`}
              width={192}
              height={128}
            />
          ) : (
            <DefaultAvatar isTeam={isTeam} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />
          
          {/* Status indicator for current user */}
          {isCurrentUser && (
            <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
              You
            </div>
          )}
        </div>

        {/* Content section with improved typography and spacing */}
        <div className="p-3 xs:p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm xs:text-base sm:text-lg font-valorant text-white truncate">
              {isTeam ? item.team_name : item.username}
            </h5>
          </div>

          {/* Team-specific content with improved layout */}
          {isTeam ? (
            <div className="mt-2">
              <div className="flex items-center justify-between gap-2">
                {/* Division badge with improved styling */}
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-md px-2 py-1 backdrop-blur-sm">
                  <img
                    className="w-6 h-6 object-contain"
                    src="https://curry.gg/uploads/703/64q9D5Bw2mASHeqoTlvoglqW7P7p1G-metaR29sZCAzLnBuZw==-.png"
                  />
                  <span className="text-xs font-pilot text-gray-300">{item.division || 'N/A'}</span>
                </div>
                
                {/* Players count with improved styling */}
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-md px-2 py-1 backdrop-blur-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-pilot text-gray-300">{item.total_members || '0'} Players</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-primary" />
                <span className="font-pilot">Player</span>
              </div>
            </div>
          )}
        </div>
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
      <div className="flex justify-center items-center h-32 xs:h-40 sm:h-48">
        <div className="animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-xs xs:text-sm sm:text-base p-4">{error}</div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="text-center my-8 p-6   max-w-md mx-auto">
        <div className="relative">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Users className="text-primary w-8 h-8" />
          </div>
        </div>

        <h3 className="text-lg font-valorant text-white mb-2">No Participants Registered</h3>

        <p className="text-gray-400 mb-6 font-mono">
          Join the competition and showcase your skills!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 xs:px-3 sm:px-4">
      <div
        className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
        gap-2 xs:gap-3 sm:gap-4"
      >
        {participants.map((item) => (
          <ParticipantOrTeamCard key={`participant-${item.registration_id}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantCardGrid;
