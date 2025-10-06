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
import TournamentStats from './TournamentStats';
export const runtime = 'edge';


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
      <div className="w-full">
  <div className="w-full max-w-full mx-auto">
    <div className="w-full space-y-8">
      {/* Tournament Stats Section - Skewed Design */}
      <div className="relative w-full">
        {/* Decorative corner accents */}
        
        {/* Main Card with clip-path */}
        <div 
          className="relative w-full overflow-hidden bg-black/40"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
        >
          {/* Background Game Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={tournament.game_image}
              alt={tournament.game_name || 'Tournament Game'}
              className="w-full h-full object-cover opacity-30"
              onError={(e) => {
                e.target.src = '/api/placeholder/400/225';
              }}
            />
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.03)_2px,rgba(255,61,8,0.03)_4px)]"></div>
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.8))]"></div>
          </div>

          {/* Top accent bar */}
          <div className="relative z-10 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 p-6 md:p-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <InfoCard
                icon={<DollarSign className="w-5 h-5 md:w-6 md:h-6" />}
                value={`${tournament.prize_pool} DH`}
                label="Prize Pool"
              />
              <InfoCard
                icon={<Gamepad2 className="w-5 h-5 md:w-6 md:h-6" />}
                value={tournament.match_format || 'Standard'}
                label="Format"
              />
              <InfoCard
                icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
                value={tournament.max_participants}
                label={tournament.participation_type}
              />
              <InfoCard
                icon={<Monitor className="w-5 h-5 md:w-6 md:h-6" />}
                value={tournament.bracket_type}
                label="Bracket Type"
              />
              <InfoCard
                icon={<Trophy className="w-5 h-5 md:w-6 md:h-6" />}
                value={tournament.participation_type}
                label="Participation"
              />
              <InfoCard
                icon={
                  <img
                    className="w-12 h-12 md:w-14 md:h-14 object-cover border-2 border-primary/50"
                    src={tournament.game_image}
                    alt={tournament.game_name}
                  />
                }
                value={tournament.game_name}
                label="Game"
              />
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="relative z-10 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>
      </div>

      {/* Tournament Rules Section - Tech Panel Style */}
      <div className="relative">
        {/* Side accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary"></div>
        
        <div className="ml-6 bg-black/60 border-l-4 border-primary p-6 md:p-8 relative overflow-hidden">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,61,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,61,8,0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* Header */}
          <div className="relative z-10 flex items-center gap-4 mb-8 pb-4 border-b-2 border-primary/30">
            <div className="w-12 h-12 bg-primary flex items-center justify-center transform -skew-x-12">
              <AlertCircle className="w-6 h-6 text-black transform skew-x-12" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-zentry text-white uppercase tracking-wider">
                Tournament Rules
              </h3>
              <div className="h-0.5 w-20 bg-primary mt-2"></div>
            </div>
          </div>
          
          {/* Rules List */}
          <div className="relative z-10 space-y-4">
            {tournament.rules.split('\n').map((rule, index) => (
              rule.trim() && (
                <div key={index} className="flex items-start gap-4 group/rule pl-4 border-l-2 border-transparent hover:border-primary/50 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 border border-primary/40 flex items-center justify-center transform -skew-x-6 group-hover/rule:bg-primary group-hover/rule:scale-110 transition-all duration-300">
                    <span className="text-sm font-bold text-primary group-hover/rule:text-black transform skew-x-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed pt-1 group-hover/rule:text-white transition-colors duration-300 font-mono">
                    {rule}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
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
  <div className="relative inline-block px-1 md:px-2 group">
    {/* Corner accents */}
    <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
      activeTab === tab ? 'border-primary' : 'border-transparent group-hover:border-white/30'
    }`}></div>
    <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
      activeTab === tab ? 'border-primary' : 'border-transparent group-hover:border-white/30'
    }`}></div>

    {/* Main button container with clip-path */}
    <div 
      className={`relative overflow-hidden transition-all duration-300 ${
        activeTab === tab ? 'scale-105' : 'group-hover:scale-102'
      }`}
      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
    >
      {/* Background */}
      <div className={`relative px-6 py-2 md:px-8 md:py-2 border transition-all duration-300 ${
        activeTab === tab 
          ? 'bg-primary border-primary/50' 
          : 'bg-black/40 border-white/10 group-hover:border-white/30 group-hover:bg-black/60'
      }`}>
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
        
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-300 ${
          activeTab === tab ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}></div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-300 ${
          activeTab === tab ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}></div>

        {/* Button */}
        <button
          onClick={() => onTabChange(tab)}
          className="relative z-10 w-full h-full flex items-center justify-center"
        >
         

          <span className={`font-free-fire tracking-widest uppercase text-sm md:text-base lg:text-lg font-bold transition-all duration-300 ${
            activeTab === tab 
              ? 'text-black' 
              : 'text-white/50 group-hover:text-white/80'
          }`}>
            {tab}
          </span>
        </button>
      </div>
    </div>

    {/* Skewed bottom shadow effect when active */}
    {activeTab === tab && (
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3/4 h-2 bg-primary/30 blur-md"
        style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
      ></div>
    )}
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

 
  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!tournament) return <div className="text-white">No tournament found.</div>;

  return (
    <>
      {isJoining && <LoadingPage />}
      <div className="relative overflow-x-hidden flex flex-col lg:flex-row gap-8   text-white p-9">
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
             <div className="w-full max-w-full mx-auto flex">
                <div className={` ${activeTab === 'Overview' ?'w-[70%]' :'w-[100%]' } `}>
                            <TabComponent activeTab={activeTab} onTabChange={setActiveTab} tournament={tournament} />

                </div>
               {
                  activeTab === 'Overview' && (
                     <div className="w-[30%]">
                    <TournamentStats tournament={tournament} />
            
                </div>
                  )
               }
              </div>
        </div>
      </div>
    </>
  );
};

export default EsportsTournamentSidebar;

const InfoCard = ({ icon, value, label }) => (
  <div className="group relative">
    {/* Decorative corner accent */}
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
    
    {/* Main card with skewed border effect */}
    <div className="relative bg-black/40  transition-all duration-300 overflow-hidden">
      {/* Top accent line */}
      {/* <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4 space-y-3">
        <div className="flex items-center gap-3">
          {/* Icon container with skew */}
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12  transform -skew-x-6 group-hover:bg-primary/20  transition-all duration-300">
            <div className="text-primary group-hover:text-white transition-colors duration-300 transform skew-x-6">
              {icon}
            </div>
          </div>
          
          {/* Value */}
          <span className="text-lg md:text-2xl font-zentry tracking-wide  text-white group-hover:text-primary transition-colors duration-300 ">
            {value}
          </span>
        </div>
        
        {/* Label with side accent */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary/50 group-hover:h-6 transition-all duration-300"></div>
          <p className="text-xs md:text-sm font-ea-football text-white/40 group-hover:text-white/70 transition-colors duration-300 uppercase tracking-widest font-bold">
            {label}
          </p>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  </div>
);
