/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CircleUserRound,
  Gamepad2,
  Plus,
  Shapes,
  ChevronDown,
  AlertCircle,
  Trophy,
  Monitor,
  Users,
  DollarSign,
} from 'lucide-react';
import PrizeList from '@/app/(DashboardLayout)/PrizeList';
import ParticipantCardGrid from '@/app/(DashboardLayout)/components/widgets/cards/ParticipantCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useTournament } from '@/contexts/TournamentContext';
import UserTournamentBracket from './tournamentBracket';
import TournamentBracket from './tournamentRoundRobin';
import SingleTournament from './tournamentBracket';
import BattleRoyale from './battle_royale';
import RoundRobinTournament from './tournamentRoundRobin';
import DoubleTournament from './tournamentDouble';

const SquadFormatCard = ({ icon, title, subTitle }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center font-bold font-pilot">
    {typeof icon === 'string' ? (
      <img src={icon} alt={title} className="w-14 h-12 mb-2" />
    ) : (
      React.cloneElement(icon, { size: 24, className: 'mb-2' })
    )}
    <h4 className="font-bold font-pilot ">{title}</h4>
    <p className="text-xs text-gray-400">{subTitle}</p>
  </div>
);

const TabComponent = ({ activeTab, onTabChange, tournament }) => {
  const tabs = ['Overview', 'Participants', 'Bracket'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderTabContent = () => {
    if (
      tournament.status === 'En cours' &&
      activeTab !== 'Overview' &&
      activeTab !== 'Participants' &&
      activeTab !== 'Bracket'
    ) {
      return (
        <div className="text-white p-6 rounded-lg text-center z-[20]">
          <h3 className="text-2xl font-bold mb-4">Tournament In Progress</h3>
          <p className="text-lg">
            The tournament is currently in progress. Some features may be limited until the
            tournament ends.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            <div className="relative w-full">
              {/* Fade effect overlay for the outer container */}

              {/* The actual content */}
              <div className="w-full rounded-lg p-3 md:p-4">
                {/* Tournament Info with Game Background */}
                <div className="w-full rounded-lg overflow-hidden">
                  {/* This is the container with relative positioning */}
                  <div className="relative w-full">
                    {/* Background Game Image Layer */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={tournament.game_image}
                        alt={tournament.game_name || 'Tournament Game'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/225';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/50"></div>

                      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-secondary/85 to-transparent"></div>

                      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-transparent to-transparent"></div>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-secondary/85 to-transparent"></div>

                      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent"></div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-secondary/85 to-transparent"></div>

                      {/* Right side fade effect */}
                      <div className="absolute inset-0 bg-gradient-to-l from-secondary via-transparent to-transparent"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-secondary/85 to-transparent"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                        {/* Left side - Tournament Info */}
                        <div className="w-full md:w-full">
                          {/* Info Cards */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            <InfoCard
                              icon={<DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                              value={`${tournament.prize_pool} DH`}
                              label="Prize Pool"
                            />
                            <InfoCard
                              icon={<Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                              value={tournament.match_format || 'Standard'}
                              label="Format"
                            />
                            <InfoCard
                              icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                              value={tournament.max_participants}
                              label={tournament.participation_type}
                            />
                            <InfoCard
                              icon={<Monitor className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                              value={tournament.bracket_type}
                              label="Bracket Type"
                            />
                            <InfoCard
                              icon={<Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                              value={tournament.participation_type}
                              label="Participation type"
                            />
                            <InfoCard
                              icon={
                                <img
                                  className='rounded-lg'
                                  width={'50px'}
                                  src={`${tournament.game_image}`}
                                />
                              }
                              value={tournament.game_name}
                              label="Tournament Game"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" text-primary">
              <h3 className="text-lg font-valorant mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                Tournament Rules
              </h3>
              <h3 className="font-pilot text-lg  my-4"></h3>
              <p className="text-sm text-gray-400 ta">   {tournament.rules.split('\n').map((rule, index) => (
                <p key={index}>{rule}</p>
              ))}</p>
            </div>

          </div>
        );
      case 'Participants':
        return <ParticipantCardGrid tournamentId={tournament.id} />;
      case 'Bracket':
        if (tournament.bracket_type === 'Single Elimination') {
          return <SingleTournament />;
        } else if (tournament.bracket_type === 'Double Elimination') {
          return <DoubleTournament />;
        } else if (tournament.bracket_type === 'Battle Royale') {
          return <BattleRoyale tournamentId={tournament.id} />;
        } else {
          return <RoundRobinTournament tournamentId={tournament.id} />;
        }
      default:
        return <p className="text-center text-gray-400">Content for {activeTab}</p>;
    }
  };

  const TabButton = ({ tab }) => (
    <div className="relative  inline-block px-4 md:px-4">
      <svg
        width="120"
        height="32"
        viewBox="0 0 100 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path
          d="M6 0H87C90.5 0 93.5 1 95.5 3L100 7.5V27.5C100 30 98 32 95.5 32H13C9.5 32 6.5 31 4.5 29L0 24.5V4.5C0 2 2 0 4.5 0H6Z"
          fill={activeTab === tab ? '#ff3d08' : 'transparent'}
        />
      </svg>
      <button
        onClick={() => onTabChange(tab)}
        className={`absolute inset-0 flex items-center justify-center text-2xl md:text-lg px-2 
          ${activeTab === tab ? 'text-white' : 'text-white/55'}`}
      >
        <span className='font-free-fire tracking-widest'>{tab}</span>
      </button>
    </div>
  );

  return (
    <div className="text-gray-300">
      {/* Desktop view */}
      <div className="hidden md:flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <TabButton key={tab} tab={tab} />
        ))}
      </div>

      {/* Mobile view */}
      <div className="md:hidden mb-4 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-gray-800 p-2 rounded-lg flex justify-between items-center"
        >
          <span>{activeTab}</span>
          <ChevronDown
            className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 mt-1 rounded-lg overflow-hidden z-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  onTabChange(tab);
                  setIsDropdownOpen(false);
                }}
                className={`w-full p-2 text-left ${activeTab === tab ? 'bg-fe5821 text-white' : 'hover:bg-gray-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className=" p-6 rounded-lg">{renderTabContent()}</div>
    </div>
  );
};

const EsportsTournamentSidebar = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isJoining, setIsJoining] = useState(false);
  const { slug } = useParams();
  const { tournament, hasJoined, loading, error, fetchTournament, checkJoinStatus, setHasJoined } =
    useTournament();

  useEffect(() => {
    fetchTournament(slug);
    console.log(tournament);
  }, [slug]);

  const LoadingPage = () => (
    <div className="fixed inset-0 flex flex-col justify-center items-center w-full h-full bg-secondary/95 backdrop-blur-sm z-50">
      <div className="relative flex flex-col items-center">
        {/* Animated background glow */}
        <div className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Logo container */}
        <div className="relative mb-8 flex justify-center">
          <div className="flex flex-col justify-center items-center">
            <Image
              src="/images/logo-gamius-white.png"
              alt="Brand Logo"
              width={300}
              height={80}
              className="cut-corners drop-shadow-lg"
            />
            
            {/* Tournament text */}
            <div className="mt-4 text-white/80 font-valorant tracking-wider text-lg">
              TOURNAMENT LOADING
            </div>
          </div>
        </div>
        
        {/* Custom animated loading indicator */}
        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="w-16 h-16 border-t-4 border-r-4 border-primary rounded-full animate-spin"></div>
          
          {/* Pulsing dot in center */}
          <div className="absolute w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text */}
        <p className="mt-6 text-white/60 font-pilot text-sm animate-pulse">
          Preparing your tournament experience...
        </p>
      </div>
    </div>
  );
  const joinTournament = async () => {
    try {
      setIsJoining(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_join_tournament.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tournament_id: tournament.id,
            user_id: userId,
          }),
        },
      );

      let data;
      try {
        data = await response.json();
        fetchTournament();
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast.error('An unexpected error occurred. Please try again.', { autoClose: 1500 });
        return;
      }

      // Log the server-side logs
      if (data.logs && Array.isArray(data.logs)) {
        console.group('Server Logs:');
        data.logs.forEach((log) => console.log(log));
        console.groupEnd();
      } else {
        console.log('No server logs available');
      }

      if (data.success) {
        toast.success(data.message, { autoClose: 1500 });
        setHasJoined(true);
        setIsJoining(false);

        // Optionally, you can update the UI or fetch updated tournament data here
      } else {
        toast.error(data.message || 'Failed to join the tournament', { autoClose: 1500 });
      }
    } catch (error) {
      console.error('Error joining tournament:', error);
      toast.error(error.message || 'An error occurred. Please try again.', { autoClose: 1500 });
    }
  };

  // const renderStatusBasedContent = () => {
  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (tournament.status === 'Ouvert aux inscriptions') {
  //     if (hasJoined) {
  //       return (
  //         <div className="text-white px-4 py-2 rounded-lg mr-2">
  //           You have joined this tournament
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <button
  //           onClick={joinTournament}
  //           className="bg-primary text-white px-4 py-2 angular-cut flex items-center mr-2"
  //         >
  //           <Plus className="w-4 h-4 mr-2" />
  //           Join Tournament
  //         </button>
  //       );
  //     }
  //   } else if (tournament.status === 'En cours') {
  //     return (
  //       <div className=" text-white px-4 py-2 rounded-lg mr-2 flex items-center">
  //         <div className="animate-pulse mr-2 h-4 w-4 bg-white rounded-full"></div>
  //         Tournament is in progress ...
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div className="text-white px-4 py-2 rounded-lg mr-2">
  //         Tournament is {tournament.status}
  //       </div>
  //     );
  //   }
  // };
  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!tournament) return <div className="text-white">No tournament found.</div>;

  return (
    <>
      {isJoining && <LoadingPage />}
      <div className="relative overflow-x-hidden flex flex-col lg:flex-row gap-8 bg-dark/70 angular-cut text-white p-9">
        <ToastContainer />

        {/* Tournament Content */}
        <div
          className={`transition-all duration-300 ease-in-out lg:w-0 lg:opacity-0 lg:overflow-hidden`}
        >
          {/* {tournament.status !== 'Terminé' && <PrizeList />} */}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out lg:w-full`}
        >
          <TabComponent activeTab={activeTab} onTabChange={setActiveTab} tournament={tournament} />
        </div>
      </div>
    </>
  );
};

export default EsportsTournamentSidebar;

const InfoCard = ({ icon, value, label }) => (
  <div className="space-y-1">
    <div className="flex items-center  gap-1 md:gap-2">
      <div className=" bg-black/15 p-2 rounded-full ">{icon}</div>

      <span className="text-sm md:text-xl font-valorant">{value}</span>
    </div>
    <p className="text-xs font-pilot md:text-sm text-gray-400">{label}</p>
  </div>
);
