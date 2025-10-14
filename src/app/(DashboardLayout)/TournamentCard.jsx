import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TournamentCard = ({
  id,
  name,
  startDate,
  groups = '2 GROUPS',
  teams = '62 TEAMS',
  prizePool,
  slug,
  featured_image,
  spots_remaining,
  registered_count,
  maxParticipants,
  tournamentType,
  tournament,
  game,
}) => {
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = dateObj.getDate().toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hour = dateObj.getHours().toString().padStart(2, '0');
    const minute = dateObj.getMinutes().toString().padStart(2, '0');
    return `${month}.${day}.${year} - ${hour}:${minute} PM`;
  };

  const getStatusBadge = () => {
    if (registered_count >= maxParticipants) {
      return { text: 'FULL', color: 'bg-red-500' };
    }
    if (spots_remaining <= 5) {
      return { text: 'ALMOST FULL', color: 'bg-yellow-500' };
    }
    const currentDate = new Date();
    const tournamentDate = new Date(startDate);

    if (currentDate > tournamentDate) {
      return { text: 'ENDED', color: 'bg-gray-500' };
    }
    return { text: 'OPEN', color: 'bg-green-500' };
  };

  const getGameBadgeColor = () => {
    const gameColors = {
      VALORANT: 'bg-red-600',
      'LEAGUE OF LEGENDS': 'bg-blue-600',
      CSGO: 'bg-yellow-600',
      CS2: 'bg-yellow-600',
      'APEX LEGENDS': 'bg-red-700',
      'DOTA 2': 'bg-green-700',
      FORTNITE: 'bg-purple-600',
      COD: 'bg-gray-700',
      OVERWATCH: 'bg-orange-500',
      'ROCKET LEAGUE': 'bg-blue-500',
    };

    return gameColors[game] || 'bg-indigo-600';
  };

  const status = getStatusBadge();
  const gameBadgeColor = getGameBadgeColor();

  // Construct image URL - handles both cases
  const imageUrl = featured_image?.startsWith('http')
    ? featured_image
    : `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${featured_image}`;

  return (
    <Link href={`/${slug}`} className="block w-full font-pilot">
      <div className="w-full h-64 sm:h-72 md:h-80 relative overflow-hidden group">
        {/* Background Image Layer */}
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>

        {/* Content Container */}
        <div className="relative h-full p-4 sm:p-5 md:p-6 flex flex-col justify-between">
          {/* Top Section */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h2 className="text-[#647693] font-zentry text-xl sm:text-2xl font-light group-hover:text-white line-clamp-2 sm:line-clamp-1">
                    {name}
                  </h2>
                  <span
                    className={`${status.color} text-xs px-3 py-1 rounded font-valorant text-white w-fit`}
                  >
                    {status.text}
                  </span>
                </div>
                <p className="text-white group-hover:text-[#647693] font-semibold text-sm">
                  {formatDate(startDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row sm:items-center text-sm -mx-4 sm:-mx-5 md:-mx-6 -mb-4 sm:-mb-5 md:-mb-6 font-semibold">
            {/* Stats */}
            <div className="grid grid-cols-3 sm:flex sm:items-center px-4 sm:px-0 mb-4 sm:mb-0 transform -translate-y-2">
              <div className="sm:pl-6 sm:mr-8 md:mr-11">
                <div className="text-[#647693] text-xs mb-1 font-valorant">PRIZE POOL</div>
                <div className="text-white text-sm">{prizePool}.00 DH</div>
              </div>

              <div className="sm:mr-8 md:mr-11">
                <div className="text-[#647693] text-xs mb-1 font-valorant">PLAYOUT</div>
                <div className="text-white uppercase text-sm">{tournamentType}</div>
              </div>

              <div className="sm:mr-8 md:mr-11">
                <div className="text-[#647693] text-xs mb-1 font-valorant">SPOTS</div>
                <div className="text-white text-sm">
                  {spots_remaining}/{maxParticipants}
                </div>
              </div>
            </div>

            {/* Button */}
            <Link
              href={`/${slug}`}
              className="group relative bg-primary/90 text-white sm:ml-auto flex items-center h-12 w-full sm:w-auto"
            >
              <div
                className="absolute left-0 top-0 bg-primary/60 h-full w-0 
                transition-all duration-300 ease-out group-hover:w-12"
              />

              <div className="h-12 w-full flex items-center justify-between">
                <span className="relative px-4 z-10 font-custom font-normal tracking-wider text-white uppercase">
                  More Details
                </span>
                <span
                  className="text-white font-custom transition-all duration-300 
                  transform translate-x-0 group-hover:translate-x-1 mr-4"
                >
                  →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TournamentCard;
