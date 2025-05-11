'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/app/(DashboardLayout)/layout/vertical/header/Header';
import { TournamentProvider, useTournament } from '@/contexts/TournamentContext';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  Plus,
  AlertCircle,
  Check,
  X,
  PlayCircle,
  ArrowLeft, // Add this import for the back button icon
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import TeamSelectionDialog from './TeamSelectionDialog';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Add this import for navigation

// Loading Component


// Helper Functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Main Layout Content Component
const LayoutContent = ({ children }) => {
  // State Management
  const [showGlow, setShowGlow] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const router = useRouter(); // Add router for navigation

  // Hooks
  const { fetchTournament, tournament, hasJoined, setHasJoined, registrationStatus, teamName } =
    useTournament();
  const { slug } = useParams();
  const { addToast } = useToast();

  // Effects
  useEffect(() => {
    if (slug) {
      fetchTournament(slug);
    }
  }, [slug, fetchTournament]);

  // Tournament Join Handlers
  const handleJoinClick = () => {
    if (tournament?.participation_type === 'team') {
      setShowTeamDialog(true);
    } else {
      joinTournament();
    }
  };

  const handleTeamSelect = async (teamId) => {
    setShowTeamDialog(false);
    joinTournament(teamId);
  };

  const joinTournament = async (teamId = null) => {
    setIsJoining(true);
    const userId = localStorage.getItem('userId');

    try {
      if (!userId) {
        addToast({
          type: 'error',
          message: 'Please login to join the tournament',
          duration: 5000,
          position: 'bottom-right',
        });
        return;
      }

      if (!tournament?.id) {
        throw new Error('Invalid tournament data');
      }

      const requestBody = {
        tournament_id: tournament.id,
        user_id: parseInt(userId),
        ...(teamId && { team_id: parseInt(teamId) }),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_join_tournament.php`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { data } = response;

      if (data.success) {
        addToast({
          type: 'success',
          message: data.message || 'Successfully joined the tournament!',
          duration: 5000,
          position: 'bottom-right',
        });
        setHasJoined(true);
        return true;
      }

      throw new Error(data.message || 'Failed to join the tournament');
    } catch (error) {
      console.error('Error joining tournament:', error);

      let errorMessage = 'An error occurred while joining the tournament';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Unable to reach the server. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      addToast({
        type: 'error',
        message: errorMessage,
        duration: 5000,
        position: 'bottom-right',
      });
      return false;
    } finally {
      setIsJoining(false);
    }
  };

  // Status Badge Component
  // Status Badge Component
  const renderStatusBadge = () => {
    if (!hasJoined || !registrationStatus) {
      return null;
    }

    // Handle various status formats that might come from the backend
    const normalizedStatus = registrationStatus.toString().toLowerCase().trim();

    const statusConfig = {
      pending: {
        icon: Clock,
        bgColor: 'bg-yellow-500',
        textColor: 'text-yellow-500',
        borderColor: 'border-yellow-500',
        label: 'Under Review',
        animation: 'animate-pulse',
      },
      approved: {
        icon: Check,
        bgColor: 'bg-green-500',
        textColor: 'text-green-500',
        borderColor: 'border-green-500',
        label: 'Accepted',
      },
      accepted: {
        icon: Check,
        bgColor: 'bg-green-500',
        textColor: 'text-green-500',
        borderColor: 'border-green-500',
        label: 'Accepted',
      },
      rejected: {
        icon: X,
        bgColor: 'bg-red-500',
        textColor: 'text-red-500',
        borderColor: 'border-red-500',
        label: 'Rejected',
      },
    };

    // Get config based on normalized status
    const config = statusConfig[normalizedStatus];

    // If no matching status is found, fall back to pending
    if (!config) {
      console.warn(`Unknown status: ${registrationStatus}, falling back to pending`);
      return null;
    }

    const StatusIcon = config.icon;

    return (
      <div className="relative group cursor-pointer px-12 py-3 rounded-xl">
        <div className="flex items-center space-x-4">
          {/* <div className={`p-2 rounded-lg ${config.bgColor}/10 ${config.animation || ''}`}>
            <StatusIcon className={`w-6 h-6 ${config.textColor}`} />
          </div> */}
          <div className="flex flex-col">
            <span className={`font-custom text-3xl ${config.textColor}`}>
              Registration {config.label}
            </span>
            {teamName && (
              <span className="text-sm text-gray-400">
                With Team: <span className="uppercase font-pilot">{teamName}</span>
              </span>
            )}
          </div>
        </div>

        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
        w-72 p-4 rounded-lg bg-secondary 
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-300 transform group-hover:-translate-y-full z-50"
        >
          <div className="relative">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${config.bgColor}/10 shrink-0`}>
                <StatusIcon className={`w-5 h-5 ${config.textColor}`} />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Registration {config.label}</h4>
                <p className="text-sm text-gray-400">
                  {normalizedStatus === 'pending' &&
                    "Your registration is being reviewed by our team. We'll notify you once a decision is made."}
                  {(normalizedStatus === 'accepted' || normalizedStatus === 'approved') &&
                    "Congratulations! You're officially registered for this tournament."}
                  {normalizedStatus === 'rejected' &&
                    'Unfortunately, your registration was not accepted. You may try again for future tournaments.'}
                </p>
              </div>
            </div>
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 
            border-8 border-transparent border-t-gray-900"
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // Join Button Component
  const renderJoinButton = () => {
    if (!tournament) return null;

    const renderJoinTournamentButton = () => {
      // Choose icon based on tournament type
      const IconComponent =
        tournament?.participation_type === 'team'
          ? Users // Show Users icon for team tournaments
          : Trophy; // Show Trophy icon for individual tournaments

      return (
        <button
          onClick={handleJoinClick}
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-white 
            px-6 py-3 flex items-center space-x-3 transition-all duration-300 
            rounded-md hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1"
        >
          {/* Animated background pulse */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0
            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
          ></div>

          {/* Icon container with animation */}
          <div className="relative flex items-center justify-center w-8 h-8 bg-white/10 rounded-full overflow-hidden">
            <IconComponent className="absolute text-white transform group-hover:scale-110 transition-transform duration-300 w-5 h-5" />
          </div>

          {/* Text with better font and spacing */}
          <span className="relative text-white font-valorant tracking-wider text-lg">
            {tournament?.participation_type === 'team' ? 'JOIN WITH TEAM' : 'JOIN TOURNAMENT'}
          </span>
        </button>
      );
    };

    const renderTournamentStatus = () => {
      const statusConfig = {
        'En cours': {
          icon: PlayCircle,
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-400',
          label: 'Tournament in Progress',
        },
        Terminé: {
          icon: Trophy,
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-400',
          label: 'Tournament Ended',
        },
        Annulé: {
          icon: AlertCircle,
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-400',
          label: 'Tournament Cancelled',
        },
      };

      const config = statusConfig[tournament?.status] || statusConfig['Terminé'];
      const StatusIcon = config.icon;

      return (
        <div
          className={`flex items-center space-x-3 px-6 py-3 ${config.bgColor} ${config.textColor} 
          font-valorant text-lg rounded-md backdrop-blur-sm border border-gray-700/50`}
        >
          {tournament?.status === 'En cours' ? (
            <div className="relative mr-2">
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></div>
            </div>
          ) : (
            <StatusIcon className="w-5 h-5" />
          )}
          <span className="tracking-wider">{config.label}</span>
        </div>
      );
    };

    const renderStatusBadge = () => {
      if (!hasJoined || !registrationStatus) {
        return null;
      }

      // Handle various status formats that might come from the backend
      const normalizedStatus = registrationStatus.toString().toLowerCase().trim();

      const statusConfig = {
        pending: {
          icon: Clock,
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-500',
          borderColor: 'border-yellow-500/30',
          label: 'Under Review',
          animation: 'animate-pulse',
        },
        approved: {
          icon: Check,
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/30',
          label: 'Accepted',
        },
        accepted: {
          icon: Check,
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/30',
          label: 'Accepted',
        },
        rejected: {
          icon: X,
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-500',
          borderColor: 'border-red-500/30',
          label: 'Rejected',
        },
      };

      // Get config based on normalized status
      const config = statusConfig[normalizedStatus];

      // If no matching status is found, fall back to pending
      if (!config) {
        console.warn(`Unknown status: ${registrationStatus}, falling back to pending`);
        return null;
      }

      const StatusIcon = config.icon;

      return (
        <div className="relative group cursor-pointer px-6 py-3 rounded-md bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${config.bgColor} ${config.animation || ''}`}>
              <StatusIcon className={`w-5 h-5 ${config.textColor}`} />
            </div>
            <div className="flex flex-col">
              <span className={`font-valorant tracking-wider text-lg ${config.textColor}`}>
                Registration {config.label}
              </span>
              {teamName && (
                <span className="text-sm text-gray-400 mt-1">
                  With Team: <span className="uppercase font-pilot">{teamName}</span>
                </span>
              )}
            </div>
          </div>

          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
          w-72 p-4 rounded-lg bg-gray-800 border border-gray-700/50
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-300 transform group-hover:-translate-y-full z-50"
          >
            <div className="relative">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${config.bgColor} shrink-0`}>
                  <StatusIcon className={`w-5 h-5 ${config.textColor}`} />
                </div>
                <div>
                  <h4 className="font-valorant text-white mb-1">Registration {config.label}</h4>
                  <p className="text-sm text-gray-400 font-pilot">
                    {normalizedStatus === 'pending' &&
                      "Your registration is being reviewed by our team. We'll notify you once a decision is made."}
                    {(normalizedStatus === 'accepted' || normalizedStatus === 'approved') &&
                      "Congratulations! You're officially registered for this tournament."}
                    {normalizedStatus === 'rejected' &&
                      'Unfortunately, your registration was not accepted. You may try again for future tournaments.'}
                  </p>
                </div>
              </div>
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 
              border-8 border-transparent border-t-gray-800"
              ></div>
            </div>
          </div>
        </div>
      );
    };

    if (tournament.status === 'registration_open') {
      return hasJoined ? renderStatusBadge() : renderJoinTournamentButton();
    }

    return renderTournamentStatus();
  };

  // Tournament Stats Component
  const renderTournamentStats = () => {
    if (!tournament) return null;

    const stats = [
      {
        icon: Clock,
        value: tournament.status,
        label: 'Status',
      },
      {
        icon: Calendar,
        value: `Registrations close on ${formatDate(tournament.end_date)}`,
        label: 'Registration Period',
      },
      {
        icon: Users,
        value: (
          <div className="flex items-center space-x-2">
            <span>
              {tournament.spots_remaining}/{tournament.max_participants} spots left
            </span>
            <div className="h-1.5 w-20 bg-gray-700/50 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (tournament.registered_count / tournament.max_participants) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>
        ),
        label: 'Available Slots',
      },
      {
        icon: Trophy,
        value: tournament.participation_type === 'team' ? 'Team Based' : 'Individual',
        label: 'Tournament Type',
      },
    ];

    return (
      <div className="flex flex-wrap gap-2 mt-6">
        {stats.map(({ icon: Icon, value, label }, index) => (
          <div key={index} className="flex items-center group">
            <div className="p-2 rounded-full bg-gray-800/40 group-hover:bg-primary/10 transition-all">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-valorant text-gray-400">{label}</p>
              <div className="text-base font-pilot text-white">{value}</div>
            </div>
            {index < stats.length - 1 && (
              <div className="mx-6 h-8 w-px bg-gray-700/50 hidden lg:block" />
            )}
          </div>
        ))}
      </div>
    );
  };
  console.log('tournament', tournament);
  return (
    <>
      {isJoining &&<div>Loading....</div>}
      <div className="relative flex flex-col min-h-screen bg-secondary">
        {/* Background Image Section */}
        <div className="absolute top-0 left-0 right-0 h-screen z-0">
          {tournament && (
            <div className="relative w-full h-full">
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.featured_image}`}
                alt="Tournament Background"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/90 to-secondary"></div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative z-20">
          <Header setIsMobileOpen={setIsMobileOpen} />
          <div className="mt-48 px-4 sm:px-8 md:px-16">
            {/* Back Button */}
            <button 
              onClick={() => router.back()} 
              className="flex items-end  text-gray-400 hover:text-white mb-4 transition-colors group"
            >
              <img className="w-7 h-7 mr-2 group-hover:-translate-x-1 transition-transform  text-gray-400" src="https://cdn.prod.website-files.com/63061d4ee85b5a18644f221c/6331c140f10fa1c58fa15071_arrow.svg" loading="lazy" alt="Arrow icon"></img>
              {/* <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> */}
              <span className="font-pilot  hover:underline">See all Tournaments</span>
            </button>
            
            {tournament && (
              <>
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  <h2 className=" flex-col text-4xl sm:text-5xl font-custom text-white mb-4">
                   <span>{tournament.name}</span> 
                   <p className='text-sm font-mono w-2/3 pt-4 text-gray-400'>{tournament.description}</p>
                  </h2>
                  {renderJoinButton()}
                </div>
                {renderTournamentStats()}
              </>
            )}
          </div>
        </div>

        {/* Main Content - Centered on X axis */}
        <main className="flex-1 flex flex-col items-center mt-4 z-30 mb-2 px-4 sm:px-8 md:px-16">
          <div className="w-full max-w-9xl mx-auto">
            {children}
          </div>
        </main>

        <TeamSelectionDialog
          isOpen={showTeamDialog}
          onClose={() => setShowTeamDialog(false)}
          onTeamSelect={handleTeamSelect}
        />
      </div>
    </>
  );
};

const Layout = ({ children }) => {
  return (
    <TournamentProvider>
      <LayoutContent>{children}</LayoutContent>
    </TournamentProvider>
  );
};

export default Layout;
