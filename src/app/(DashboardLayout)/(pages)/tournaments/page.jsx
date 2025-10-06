'use client';
import React, { useState, useEffect } from 'react';
import { SearchX } from 'lucide-react';
import TournamentCard from '../../TournamentCard';
import { ToastContainer } from 'react-toastify';
import { IconTournament } from '@tabler/icons-react';
const LeagueOfLegendsProfile = () => {
  const [filters, setFilters] = useState({
    format_des_qualifications: '',
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data)
          const filteredTournaments = data.tournaments.filter(
            (tournament) =>
              tournament.status === 'En cours' || tournament.status === 'Ouvert aux inscriptions',
          );
          setTournaments(data.tournaments);
          setFilteredTournaments(filteredTournaments);
        } else {
          setError(data.message || 'Échec de la récupération des tournois.');
        }
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setError('Une erreur est survenue lors de la récupération des tournois');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = tournaments.filter((tournament) => {
      const matchesFilters =
        (filters.format_des_qualifications === '' ||
          tournament.format_des_qualifications === filters.format_des_qualifications) &&
        (filters.status === '' || tournament.status === filters.status);
      const matchesSearch = tournament.nom_des_qualifications
        
      return matchesFilters && matchesSearch;
    });
    setFilteredTournaments(filtered);
  }, [filters, tournaments, searchTerm]);

  const filterOptions = {
    format_des_qualifications: [
      { value: '', label: 'Format' },
      { value: 'Single Elimination', label: 'Single Elimination' },
    ],
    status: [
      { value: '', label: 'Statut' },
      { value: 'Ouvert aux inscriptions', label: 'Ouvert aux inscriptions' },
      { value: 'En cours', label: 'En cours' },
    ],
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white   p-16 rounded-lg shadow-lg">
      <ToastContainer />

      {/* <h3 className="text-4xl sm:text-5xl lg:text-6xl tracking-wider mb-6 sm:mb-8 lg:mb-10 uppercase font-custom">
        TOURNAMENT CENTRAL .{' '}
        <span className="text-primary block sm:inline mt-2 sm:mt-0">FORGE YOUR LEGACY</span>
      </h3> */}
        <div className="mb-8">
        <div className="flex items-center justify-between  ">
         <div className="relative inline-block">
  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-zentry special-font">
    <span className="relative inline-block text-white">
      TOURNAMENT CENTRAL
    </span>
    <br />
    
    {/* Primary text with special effects */}
    <span className="relative inline-block group">
      {/* Glowing background */}
      <span className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-400/20 to-orange-500/20 blur-2xl animate-pulse"></span>
      
      {/* Main text with gradient */}
      <span className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
        FORGE YOUR LEGACY!
      </span>
      
      {/* Scanline effect overlay */}
      <span className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)] pointer-events-none"></span>
      
      {/* Animated scan beam */}
      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent h-full w-full opacity-0 animate-scan pointer-events-none"></span>
      
      {/* Glitch lines */}
      <span className="absolute left-0 top-1/4 w-full h-px bg-orange-500/50 animate-glitch-1"></span>
      <span className="absolute left-0 top-2/4 w-full h-px bg-orange-400/50 animate-glitch-2"></span>
      <span className="absolute left-0 top-3/4 w-full h-px bg-orange-500/50 animate-glitch-3"></span>
      
      {/* Corner brackets */}
      <span className="absolute -left-2 -top-1 w-4 h-4 border-t-2 border-l-2 border-orange-500 opacity-70"></span>
      <span className="absolute -right-2 -top-1 w-4 h-4 border-t-2 border-r-2 border-orange-500 opacity-70"></span>
      <span className="absolute -left-2 -bottom-1 w-4 h-4 border-b-2 border-l-2 border-orange-500 opacity-70"></span>
      <span className="absolute -right-2 -bottom-1 w-4 h-4 border-b-2 border-r-2 border-orange-500 opacity-70"></span>
      
      {/* Digital noise effect */}
      <span className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></span>
    </span>
  </h1>
</div>

<style jsx>{`
  @keyframes gradient {
    0%, 100% { background-position: 0% center; }
    50% { background-position: 100% center; }
  }
  
  @keyframes scan {
    0% { top: -100%; opacity: 0; }
    50% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  
  @keyframes glitch-1 {
    0%, 100% { transform: translateX(0); opacity: 0.5; }
    25% { transform: translateX(-5px); opacity: 0.8; }
    50% { transform: translateX(5px); opacity: 0.3; }
    75% { transform: translateX(-3px); opacity: 0.6; }
  }
  
  @keyframes glitch-2 {
    0%, 100% { transform: translateX(0); opacity: 0.3; }
    33% { transform: translateX(4px); opacity: 0.7; }
    66% { transform: translateX(-4px); opacity: 0.4; }
  }
  
  @keyframes glitch-3 {
    0%, 100% { transform: translateX(0); opacity: 0.4; }
    40% { transform: translateX(-6px); opacity: 0.6; }
    80% { transform: translateX(3px); opacity: 0.5; }
  }
  
  .animate-gradient {
    animation: gradient 3s ease infinite;
  }
  
  .animate-scan {
    animation: scan 4s ease-in-out infinite;
  }
  
  .animate-glitch-1 {
    animation: glitch-1 2.5s ease-in-out infinite;
  }
  
  .animate-glitch-2 {
    animation: glitch-2 3s ease-in-out infinite;
  }
  
  .animate-glitch-3 {
    animation: glitch-3 2.8s ease-in-out infinite;
  }
`}</style>
        <div className="flex items-center gap-3">
 
</div>
        </div>
        
        <p className="text-gray-400 text-sm sm:text-base max-w-3xl leading-relaxed mb-6 font-circular-web">
          Discover your community on GAMIUS! Team up with players who share your passion. Chat, 
          strategize, and queue together for victory. Take on exciting events, conquer the Team Rankings, 
          score epic prizes, and make every match more fun!
        </p>
      </div>
       
      {/* <div className="my-8">
        <div className="flex items-center text-primary">
          <IconTournament />
          <p className="mx-2 text-lg font-bold font-zentry uppercase ">FORGE YOUR LEGACY</p>
        </div>

        <h1 className="text-4xl flex items-center font-custom tracking-wider"></h1>
      </div> */}
      {tournaments.length === 0 ? (
        <div className="text-center text-gray-400 mt-8 p-4">
          <SearchX className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16" />
          <p className="text-sm sm:text-base">
            Vous navez participé à aucun tournoi correspondant à votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              id={tournament.id}
              name={tournament.name}
              startDate={tournament.start_date}
              endDate={tournament.end_date}
              status={tournament.status}
              description_des_qualifications={tournament.description}
              maxParticipants={tournament.max_participants}
              format_des_qualifications={tournament.format_des_qualifications}
              type_de_match={tournament.type_de_match}
              type_de_jeu={tournament.type_de_jeu}
              featured_image={tournament.featured_image}
              prizePool={tournament.prize_pool}
              slug={tournament.slug}
              spots_remaining={tournament.spots_remaining}
              tournamentType={tournament.participation_type}
              registered_count={tournament.registered_count}
              game={tournament.game}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeagueOfLegendsProfile;
  



