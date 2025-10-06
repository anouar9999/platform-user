import React from 'react';
import { Users, Trophy, PlayCircle, AlertCircle, Clock, Check, X, Sparkles } from 'lucide-react';

// Configuration objects
const TOURNAMENT_STATUS_CONFIG = {
  'En cours': {
    icon: PlayCircle,
    gradient: 'from-cyan-500 to-blue-600',
    label: 'Live Now',
    dotColor: 'bg-cyan-400',
  },
  Terminé: {
    icon: Trophy,
    gradient: 'from-slate-500 to-slate-600',
    label: 'Concluded',
    dotColor: 'bg-slate-400',
  },
  Annulé: {
    icon: AlertCircle,
    gradient: 'from-rose-500 to-red-600',
    label: 'Cancelled',
    dotColor: 'bg-rose-400',
  },
};

const REGISTRATION_STATUS_CONFIG = {
  pending: {
    icon: Clock,
    bg: 'bg-amber-400 ',
    label: 'Reviewing',
    message: "We're reviewing your registration. You'll hear from us soon!",
    dotColor: 'bg-amber-400',
  },
  approved: {
    icon: Check,
    bg: 'bg-green-600',
    label: 'Confirmed',
    message: "You're in! Get ready for an epic tournament.",
    dotColor: 'bg-emerald-400',
  },
  accepted: {
    icon: Check,
    bg: 'bg-green-600',
    label: 'Confirmed',
    message: "You're in! Get ready for an epic tournament.",
    dotColor: 'bg-emerald-400',
  },
  rejected: {
    icon: X,
    bg: 'bg-red-600',
    label: 'Declined',
    message: 'Not this time, but keep trying for future tournaments!',
    dotColor: 'bg-rose-400',
  },
};

// Animated gradient background
const AnimatedGradient = ({ gradient }) => (
  <div
    className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
  />
);

// Shimmer effect
const ShimmerEffect = () => (
  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
    <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
  </div>
);

// Join Button Component
const JoinButton = ({ participationType, onClick }) => {
  const IconComponent = participationType === 'team' ? Users : Trophy;
  const buttonText = participationType === 'team' ? 'Join with Team' : 'Enter Tournament';
  const isTeam = participationType === 'team';

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden bg-primary
        text-white px-6 py-4 
        hover:shadow-2xl hover:shadow-primary rounded transition-all duration-300 
        hover:scale-105 active:scale-95"
      aria-label={buttonText}
    >
      {/* Shimmer effect */}
      <ShimmerEffect />

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />

      {/* Content */}
      <div className="relative flex items-center gap-3">
        {/* <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <IconComponent className="w-5 h-5" />
        </div> */}
        <span className="font-zentry text-lg tracking-wide">{buttonText}</span>
        <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
};

// Pulse animation for live status
const LivePulse = ({ dotColor }) => (
  <div className="relative flex items-center justify-center w-6 h-6">
    <div className={`absolute w-full h-full ${dotColor} rounded-full animate-ping opacity-75`} />
    <div className={`relative w-3 h-3 ${dotColor} rounded-full`} />
  </div>
);

// Tournament Status Display
const TournamentStatusDisplay = ({ status }) => {
  const config = TOURNAMENT_STATUS_CONFIG[status] || TOURNAMENT_STATUS_CONFIG['Terminé'];
  const StatusIcon = config.icon;
  const isLive = status === 'En cours';

  return (
    <div
      className={`group relative overflow-hidden bg-gradient-to-br ${config.gradient} 
        text-white px-8 py-4 rounded-2xl shadow-lg
        border border-white/10 backdrop-blur-sm`}
      role="status"
      aria-label={config.label}
    >
      <AnimatedGradient gradient={config.gradient} />

      <div className="relative flex items-center gap-4">
        {isLive ? (
          <LivePulse dotColor={config.dotColor} />
        ) : (
          <div className="p-2 bg-white/20 rounded-lg">
            <StatusIcon className="w-5 h-5" />
          </div>
        )}
        <span className="font-bold text-lg tracking-wide">{config.label}</span>
      </div>
    </div>
  );
};

// Registration Status Badge
const RegistrationStatusBadge = ({ registrationStatus, teamName }) => {
  const normalizedStatus = registrationStatus?.toString().toLowerCase().trim();
  const config = REGISTRATION_STATUS_CONFIG[normalizedStatus];

  if (!config) {
    console.warn(`Unknown registration status: ${registrationStatus}`);
    return null;
  }

  const StatusIcon = config.icon;

  return (
    <div className="group relative">
      <div
        className={`relative overflow-hidden   ${config.bg} 
          text-black px-6 py-4  shadow-lg
        cursor-pointer
          hover:shadow-xl transition-all duration-300`}
      >
        <AnimatedGradient gradient={config.gradient} />

        <div className="relative flex items-start gap-4">
          <div className="p-2.5 rounded-xl backdrop-blur-sm shrink-0">
            <StatusIcon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-zentry text-xl tracking-wide">{config.label}</span>
            </div>

            <p className="text-black text-sm font-circular-web leading-relaxed mb-2">
              {config.message}
            </p>

            {teamName && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/20">
                {/* <Users className="w-4 h-4 opacity-75" /> */}

                <span className="text-sm  font-circular-web opacity-90">
                  Participing with Team:{' '}
                  <span className="text-xl font-zentry text-orange-700"> {teamName}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
const TournamentJoinButton = ({
  tournament,
  hasJoined,
  registrationStatus,
  teamName,
  onJoinClick,
}) => {
  if (!tournament) return null;

  if (tournament.status === 'registration_open') {
    return hasJoined ? (
      <RegistrationStatusBadge registrationStatus={registrationStatus} teamName={teamName} />
    ) : (
      <JoinButton participationType={tournament.participation_type} onClick={onJoinClick} />
    );
  }

  return <TournamentStatusDisplay status={tournament.status} />;
};

export default TournamentJoinButton;
