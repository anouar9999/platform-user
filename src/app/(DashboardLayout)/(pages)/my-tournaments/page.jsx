'use client';
import React, { useState, useEffect } from 'react';
import { Search, SearchX } from 'lucide-react';
import TournamentCard from '../../TournamentCard';
import { ToastContainer } from 'react-toastify';
import { IconTournament } from '@tabler/icons-react';
import ScannableTitle from '../../components/ScannableTitle';

const ParticipantTournaments = ({ participantId }) => {
  const [filters, setFilters] = useState({
    bracket_type: '',
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Access localStorage only after component mounts (client-side)
      const localAuthData = localStorage.getItem('authData');

      const parsedData = JSON.parse(localAuthData);
      console.log(parsedData)
    const user_id = parsedData.userId;
    setUserId(parsedData.userId);
    console.log("User ID:", parsedData.userId);

   if (true) {
      setIsLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/my-tournament.php?user_id=${parsedData.userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            console.log("Retrieved tournaments:", data);
            setTournaments(data.tournaments);
            setFilteredTournaments(data.tournaments);
          } else {
            setError(data.message || 'Échec de la récupération des tournois du participant');
          }
        })
        .catch((error) => {
          console.error('Erreur:', error);
          setError('Une erreur est survenue lors de la récupération des tournois du participant');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [participantId]);

  const filterOptions = {
    bracket_type: [
      { value: '', label: 'Format' },
      { value: 'Single Elimination', label: 'Single Elimination' },
      { value: 'Double Elimination', label: 'Double Elimination' },
      { value: 'Round Robin', label: 'Round Robin' },
    ],
    status: [
      { value: '', label: 'Statut' },
      { value: 'registration_open', label: 'Ouvert aux inscriptions' },
      { value: 'ongoing', label: 'En cours' },
      { value: 'completed', label: 'Terminé' },
    ],
  };

  if (error) {
    return <div className=" p-24 flex justify-center items-center text-red-500">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white p-12 xl:p-18 rounded-lg">
      <ToastContainer />

      {/* <h3 className="text-5xl md:text-4xl lg:text-5xl tracking-wider mb-10 uppercase font-custom">
        {' '}
        YOUR TOURNAMENT JOURNEY <br/><span className='text-primary'> FROM CHALLENGER TO CHAMPION </span> 
      </h3> */}
<div className="my-8">
  <div className="mb-8">
          <div className="flex items-center justify-between  ">
               <ScannableTitle 
    primaryText= { 'MY TOURNAMENTS'}
    secondaryText="YOUR TOURNAMENT JOURNEY !"
  />
          <div className="flex items-center gap-3">
   
  </div>
          </div>
          
          <p className="text-gray-400 text-sm sm:text-base max-w-3xl leading-relaxed mb-6 font-circular-web">
            Discover your community on GAMIUS! Team up with players who share your passion. Chat, 
            strategize, and queue together for victory. Take on exciting events, conquer the Team Rankings, 
            score epic prizes, and make every match more fun!
          </p>
        </div>
       

      </div>
      {(tournaments?.length ?? 0) === 0  ? (
        <div className="text-center text-gray-400 mt-8">
          <SearchX className="mx-auto mb-4 w-16 h-16" />
          <p>Vous n avez participé à aucun tournoi correspondant à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          {tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              id={tournament.id}
              name={tournament.name}
              startDate={tournament.start_date}
              endDate={tournament.end_date}
              status={tournament.status}
              description={tournament.description}
              maxParticipants={tournament.max_participants}
              bracket_type={tournament.bracket_type}
              match_format={tournament.match_format}
              game_name={tournament.game_name}
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

export default ParticipantTournaments;
