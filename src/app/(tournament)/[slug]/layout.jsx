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
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import TeamSelectionDialog from './TeamSelectionDialog';
import axios from 'axios';

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
          className="group relative overflow-hidden bg-primary text-primary px-4 py-2
            flex items-center space-x-3 transition-all duration-300 angular-cut
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
        >
          {/* Animated background gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0
            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
          ></div>

          {/* Icon container with animation */}
          <div className="relative flex items-center justify-center w-6 h-6 overflow-hidden">
            <IconComponent className="absolute text-white transform group-hover:-translate-y-full transition-transform duration-300 w-5 h-5" />
            <IconComponent className="absolute text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-5 h-5" />
          </div>

          {/* Text with better font and spacing */}
          <span className="relative text-white font-pilot font-semibold tracking-wide">
            {tournament?.participation_type === 'team' ? 'Join with Team' : 'Join Tournament'}
          </span>
        </button>
      );
    };

    const renderTournamentStatus = () => {
      const statusConfig = {
        'En cours': {
          icon: PlayCircle,
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-400',
          label: 'Tournament in Progress',
        },
        Terminé: {
          icon: Trophy,
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-400',
          label: 'Tournament Ended',
        },
        Annulé: {
          icon: AlertCircle,
          bgColor: 'bg-red-500',
          textColor: 'text-red-400',
          label: 'Tournament Cancelled',
        },
      };

      const config = statusConfig[tournament?.status] || statusConfig['Terminé'];
      const StatusIcon = config.icon;

      return (
        <div
          className={`flex items-center space-x-3 px-6 py-3 ${config.textColor} 
          font-custom text-2xl rounded-xl backdrop-blur-sm`}
        >
          {tournament?.status === 'En cours' ? (
            <div className="relative">
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></div>
            </div>
          ) : (
            <StatusIcon className="w-5 h-5" />
          )}
          <span className="font-medium">{config.label}</span>
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
        <div className="absolute top-0 left-0 right-0 h-1/3 z-0">
          {tournament && (
            <div className="relative w-full h-full">
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.featured_image}`}
                alt="Tournament Background"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/70 to-secondary"></div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative z-20">
          <Header setIsMobileOpen={setIsMobileOpen} />
          <div className="mt-40 px-4 sm:px-8 md:px-16">
            {tournament && (
              <>
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  <h2 className="text-4xl sm:text-5xl font-custom text-white mb-4">
                    {tournament.name}
                  </h2>
                  {renderJoinButton()}
                </div>
                {renderTournamentStats()}
              </>
            )}
          </div>
        </div>

        <main className="flex-1 flex flex-col mt-8 pl-4 sm:pl-8 md:pl-16 z-30 mb-2">
          {children}
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
