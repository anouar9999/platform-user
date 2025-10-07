'use client';
import React, { useState, useEffect } from 'react';
import { SearchX } from 'lucide-react';
import TournamentCard from '../../TournamentCard';
import { ToastContainer } from 'react-toastify';
import { IconTournament } from '@tabler/icons-react';
import ScannableTitle from '../../components/ScannableTitle';

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
          console.log(data);
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
      const matchesSearch = tournament.nom_des_qualifications;

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
    return <div className="text-red-500 p-4 text-sm sm:text-base">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 lg:h-24 lg:w-24 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white p-12 xl:p-16 rounded-lg shadow-lg">
      <ToastContainer />

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between  ">
               <ScannableTitle 
    primaryText= { 'TOURNAMENTs'}
    secondaryText="TOURNAMENT CENTRAL. FORGE YOUR LEGACY! !"
  />
          <div className="flex items-center gap-3">
   
  </div>
          </div>
       

        <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-full lg:max-w-3xl leading-relaxed font-circular-web">
          Discover your community on GAMIUS! Team up with players who share your passion. Chat,
          strategize, and queue together for victory. Take on exciting events, conquer the Team
          Rankings, score epic prizes, and make every match more fun!
        </p>
      </div>

      {tournaments.length === 0 ? (
        <div className="text-center text-gray-400 mt-6 sm:mt-8 p-4">
          <SearchX className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
          <p className="text-xs sm:text-sm md:text-base">
            Vous navez participé à aucun tournoi correspondant à votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {tournaments.map((tournament) => (
           <>
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
           </>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeagueOfLegendsProfile;