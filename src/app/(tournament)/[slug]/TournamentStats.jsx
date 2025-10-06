import React from 'react';
import { Clock, Calendar, Users, Trophy, Zap, AlertCircle } from 'lucide-react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const ProgressBar = ({ current, max }) => {
  const percentage = Math.round((current / max) * 100);
  const spotsLeft = max - current;
  const isLow = spotsLeft < max * 0.2;
  const isCritical = spotsLeft < max * 0.1;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${
            isCritical ? 'text-rose-500' : isLow ? 'text-orange-500' : 'text-indigo-600'
          }`}>
            {spotsLeft}
          </span>
          <span className="text-gray-500 font-medium">spots left</span>
        </div>
        <div className="text-sm text-gray-400">
          {current}/{max} registered
        </div>
      </div>
      
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isCritical 
              ? 'bg-gradient-to-r from-rose-500 to-pink-500' 
              : isLow 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {isCritical && (
        <div className="flex items-center gap-2 text-rose-600 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>Limited spots - Register now!</span>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    if (status === 'registration_open') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (status === 'En cours') {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (status === 'Terminé') {
      return 'bg-gray-100 text-gray-700 border-gray-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusText = () => {
    if (status === 'registration_open') return 'Registration Open';
    if (status === 'En cours') return 'Live Now';
    if (status === 'Terminé') return 'Completed';
    return status;
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${getStatusStyle()}`}>
      <div className={`w-2 h-2 rounded-full ${
        status === 'registration_open' ? 'bg-emerald-500 animate-pulse' : 
        status === 'En cours' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
      }`} />
      {getStatusText()}
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, children, gradient, bgImage }) => (
  <div className="relative p-6 shadow-sm  hover:shadow-md transition-shadow overflow-hidden group">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    />
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/85 backdrop-blur-sm" />
    
    {/* Content */}
    <div className="relative z-10 flex items-start gap-4">
     
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {label}
        </div>
        <div className="text-primary font-zentry">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const TournamentStats = ({ tournament }) => {
  if (!tournament) return null;

  return (
    <div className=" sticky max-w-full mx-auto ">
     

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1  gap-1">
        <InfoCard 
          icon={Clock} 
          label="Current Status"
          gradient="from-emerald-500 to-teal-500"
          bgImage="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop"
        >
          <div className="text-2xl font-bold">
            {tournament.status === 'registration_open' 
              ? 'Open for Registration' 
              : tournament.status === 'En cours' 
              ? 'Tournament Live' 
              : tournament.status === 'Terminé' 
              ? 'Completed' 
              : tournament.status}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {tournament.status === 'registration_open' && 'Accepting new participants'}
            {tournament.status === 'En cours' && 'Competition is ongoing'}
            {tournament.status === 'Terminé' && 'Event has concluded'}
          </div>
        </InfoCard>

        <InfoCard 
          icon={Calendar} 
          label="Registration Deadline"
          gradient="from-purple-500 to-purple-600"
          bgImage="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop"
        >
          <div className="text-2xl font-bold">{formatDate(tournament.end_date)}</div>
          <div className="text-sm text-gray-500 mt-1">Make sure to register before this date</div>
        </InfoCard>

         <InfoCard 
            icon={Users} 
            label="Available Spots"
            gradient="from-indigo-500 to-blue-500"
            bgImage="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop"
          >
            <ProgressBar 
              current={tournament.registered_count} 
              max={tournament.max_participants} 
            />
          </InfoCard>

        <InfoCard 
          icon={Trophy} 
          label="Competition Format"
          gradient="from-amber-500 to-orange-500"
          bgImage="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop"
        >
          <div className="text-2xl font-bold">
            {tournament.participation_type === 'team' ? 'Team Competition' : 'Solo Competition'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {tournament.participation_type === 'team' ? 'Compete with your squad' : 'Individual challenge'}
          </div>
        </InfoCard>
      </div>

     
    </div>
  );
};

export default TournamentStats;