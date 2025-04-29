import React, { useEffect, useState } from 'react';
import { X, UserPlus, Trophy, Shield, Users, Star, Award, Target, Clock, DollarSign, Gamepad2, Monitor } from 'lucide-react';

const NonOwnerView = ({ team, isOpen, onClose, onJoinRequest }) => {
  const [isInvolved, setIsInvolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkTeamInvolvement = async () => {
      if (!team) return;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // First check if user is team owner
        if (team.owner_id === parseInt(userId)) {
          setIsInvolved(true);
          setIsLoading(false);
          return;
        }

        // Then check team membership
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check_team_involvement.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            team_id: team.id,
            user_id: userId
          })
        });

        const data = await response.json();
        if (data.success) {
          setIsInvolved(data.is_involved);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error checking team involvement:', error);
        setError('Failed to check team membership status');
      } finally {
        setIsLoading(false);
      }
    };

    // Get team members
    const fetchTeamMembers = async () => {
      if (!team) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/team_api.php?endpoint=team-members&team_id=${team.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.success && data.data.members) {
          setTeamMembers(data.data.members);
        } else {
          console.error('Failed to fetch team members:', data.message);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    checkTeamInvolvement();
    fetchTeamMembers();
  }, [team]);

  if (!team || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-secondary backdrop-blur-md" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all bg-secondary/50 backdrop-blur-xl rounded-2xl shadow-2xl">
          {/* Hero Header */}
          <div className="relative h-auto md:h-40">
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: team.banner 
                    ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.banner})`
                    : 'url(/api/placeholder/1200/300)',
                  filter: 'brightness(0.4)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/60 to-secondary" />
            </div>

            <div className="relative px-4 md:px-8 py-6 md:py-16">
              <div className="flex flex-col md:flex-row gap-6 md:gap-0 md:items-center justify-between">
                {/* Team Info - Left Side */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center w-full">
                  <div className="flex gap-4 md:gap-6 items-center">
                    <img
                      src={team.logo 
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}` 
                        : '/api/placeholder/48/48'}
                      alt="Team Logo"
                      className="w-12 h-12 rounded-lg"
                    />
                    <div>
                      <h2 className="text-lg md:text-xl font-valorant text-white flex items-center gap-2 flex-wrap">
                        {team.name}
                        {team.tag && (
                          <span className="text-sm px-2 py-1 bg-primary/20 rounded text-primary">{team.tag}</span>
                        )}
                      </h2>
                      <p className="text-gray-400 text-sm">Founded {new Date(team.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Stats - Centered on mobile, right-aligned on desktop */}
                  <div className="flex gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                    {[
                      { label: 'WINS', value: team.wins || '0', color: 'text-blue-400' },
                      { label: 'LOSSES', value: team.losses || '0', color: 'text-gray-400' },
                      { label: 'DRAWS', value: team.draws || '0', color: 'text-yellow-400' }
                    ].map(stat => (
                      <div key={stat.label} className="text-center">
                        <p className={`text-xl md:text-2xl font-valorant ${stat.color}`}>{stat.value}</p>
                        <p className="text-gray-500 text-xs md:text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join Button - Full width on mobile */}
                {!isInvolved && (
                  <div className="w-full md:w-auto mt-4 md:mt-0">
                    <button
                      onClick={() => onJoinRequest(team.id)}
                      className="group relative flex items-center w-full md:w-44 overflow-hidden bg-primary"
                    >
                      {/* Hidden lighter section that shows on hover */}
                      <div className="absolute left-0 top-0 bg-dark h-full w-0 
                        transition-all duration-300 ease-out group-hover:w-32" 
                      />
                      
                      {/* Button content */}
                      <div className="h-12 w-full flex items-center justify-between px-4">
                        <span className="relative z-10 font-custom tracking-wider text-white uppercase">
                          join the team
                        </span>
                        
                        <span className="text-white font-custom transition-all duration-300 
                          transform translate-x-0 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Close Button - Adjusted position */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 
                    hover:bg-gray-800/50 rounded-xl transition-all duration-300 
                    hover:scale-105 group z-10"
                >
                  <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className=" p-6">
            <h3 className="text-white font-valorant mb-4">ABOUT THE TEAM</h3>
            <SocialLinks team={team} />
            <p className="text-gray-400 leading-relaxed">
              {team.description || "No team description available."}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users} value={team.total_members || '0'} label="Members" gradient="bg-purple-500/10" />
              <StatCard icon={Trophy} value={`${team.win_rate || '0'}%`} label="Win Rate" gradient="bg-green-500/10" />
              <StatCard icon={Star} value={team.tier || 'amateur'} label="Team Tier" gradient="bg-yellow-500/10" />
              <StatCard icon={Award} value={team.division || '-'} label="Division" gradient="bg-blue-500/10" />
            </div>
            <div className="relative w-full">
            <div className="w-full rounded-lg p-3 md:p-4">
                {/* Tournament Info with Game Background */}
                <div className="w-full rounded-lg overflow-hidden">
                  {/* This is the container with relative positioning */}
                  <div className="relative w-full">
                    {/* Background Game Image Layer */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={`${team.game.image}`}
                        alt={'Tournament Game'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/225';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary   via-secondary/85 to-secondary/50"></div>

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
                              icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                              value={team.total_members}
                              label={"Total Members"}
                            />
                            <InfoCard
                              icon={<Monitor className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                              value={team.tier}
                              label="Team Tier"
                            />
                            <InfoCard
                              icon={<Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                              value={new Date(team.created_at).toLocaleDateString()}
                              label="Team Created"
                            />
                            <InfoCard
                                icon={
                                  <img
                                  className='rounded-lg'
                                    width={'50px'}
                                    src={`${team.game.image}`}
                                  />
                                }
                                value={team.game.name}
                                label="Team Game"
                              />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            {/* <TeamDetails team={team} /> */}
            <TeamMembers team={team} members={team.members} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLinks = ({ team }) => (
  <div className="flex gap-4 mb-4">
    {team.twitter && (
      <a href={team.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
    )}
    {team.discord && (
      <a href={team.discord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
        </svg>
      </a>
    )}
    {team.contact_email && (
      <a href={`mailto:${team.contact_email}`} className="text-gray-400 hover:text-white">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </svg>
      </a>
    )}
  </div>
);

const StatCard = ({ icon: Icon, value, label, gradient }) => (
  <div className={`${gradient} rounded-xl p-6 group hover:scale-105 transition-all duration-300`}>
    <div className="flex flex-col items-center">
      <div className="p-3 bg-white/5 rounded-lg mb-2 group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-white" />
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-sm font-valorant text-gray-300">{label}</span>
    </div>
  </div>
);

const TeamDetails = ({ team }) => (
  <div className="bg-gray-800/30 rounded-xl p-6">
    <div className="grid grid-cols-2 gap-6">
      {[
        { label: 'Game', value: team.game.name, icon: Target },
        { label: 'Total Members', value: team.total_members || '0', icon: Users },
        { label: 'Tier', value: team.tier || 'amateur', icon: Shield },
        { label: 'Created', value: new Date(team.created_at).toLocaleDateString(), icon: Clock }
      ].map(item => (
        <DetailItem key={item.label} label={item.label} value={item.value} icon={<item.icon size={16} className="text-primary" />} />
      ))}
    </div>
  </div>
);

// Helper function to get game name
function getGameNameById(gameId) {
  const games = {
    1: 'Free Fire',
    2: 'Valorant',
    3: 'Fc Football',
    4: 'Street Fighter'
  };
  return games[gameId] || 'Unknown Game';
}

const DetailItem = ({ label, value, icon }) => (
  <div>
    <h4 className="text-sm font-pilot text-gray-400 mb-1">{label}</h4>
    <p className="text-xl font-valorant text-white flex items-center gap-2">
      {icon}
      {value}
    </p>
  </div>
);

const TeamMembers = ({ team, members }) => (
  <div>
    <h3 className="text-lg font-valorant text-primary mb-4 flex items-center gap-2">
      <Users size={20} className="" />
      Team Members
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {members.length > 0 ? (
        members.map((member) => (
          <MemberCard 
            key={member.id} 
            member={member} 
            isOwner={member.user_id === team.owner_id}
          />
        ))
      ) : (
        <p className="text-gray-400 col-span-2">No team members found.</p>
      )}
    </div>
  </div>
);

const MemberCard = ({ member, isOwner }) => {
  const defaultAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <circle cx="64" cy="64" r="64" fill="#1F2937"/>
    <path d="M108 128C108 103.699 88.3005 84 64 84C39.6995 84 20 103.699 20 128" fill="#374151"/>
    <circle cx="64" cy="50" r="24" fill="#374151"/>
  </svg>`;

  return (
    <div className="group relative bg-dark/40 hover:bg-secondary/60 backdrop-blur-sm angular-cut p-2 sm:p-3 transition-all  ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
        {/* Avatar */}
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden   flex-shrink-0">
          <img
            src={member.avatar ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${member.avatar}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
            alt={member.username || 'Team member'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="font-valorant text-base sm:text-lg text-white truncate">
            {member.username}
          </div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className="inline-flex px-2 sm:px-3  sm:.5  text-xs sm:text-sm font-medium text-gray-300 rounded-lg">
              {member.role || 'Member'}
            </span>
            
            {isOwner && (
              <span className="inline-flex px-2 sm:px-3  sm:.5  text-xs sm:text-sm font-medium text-yellow-400 rounded-lg">
                Team Owner
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonOwnerView;
const InfoCard = ({ icon, value, label }) => (
  <div className="space-y-1">
    <div className="flex items-center  gap-1 md:gap-2">
      <div className=" bg-black/15 p-2 rounded-full ">{icon}</div>

      <span className="text-sm md:text-xl font-valorant">{value}</span>
    </div>
    <p className="text-xs font-pilot md:text-sm text-gray-400">{label}</p>
  </div>
);