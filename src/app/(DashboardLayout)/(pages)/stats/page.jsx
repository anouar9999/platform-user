"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Settings, Trophy, Users, Target, ArrowUp, Star, Shield, Mail, Calendar, User } from 'lucide-react';

const Profile = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({
    username: '',
    email: '',
    type: '',
    points: 0,
    rank: '',
    bio: '',
    avatar: '',
    user_type: '',
    tournament_stats: {
      individual_participations: 0,
      team_participations: 0,
      total_participations: 0
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const localAuthData = localStorage.getItem('authData');
    const parsedData = JSON.parse(localAuthData);
    const user_id = parsedData.userId;
    setUserId(user_id);
    
    if (user_id) fetchUserSettings(user_id);
  }, []);

  const fetchUserSettings = async (user_id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_settings.php?id=${user_id}`);
      console.log(response.data.data);
      if (response.data) {
        setUser(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (err) {
      setError('Failed to fetch user settings');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, gradientFrom, gradientTo }) => (
    <div className="relative inline-block px-1 group">
      <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 ${color} transition-all duration-300 group-hover:w-3 group-hover:h-3`}></div>
      <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 ${color} transition-all duration-300 group-hover:w-3 group-hover:h-3`}></div>
      
      <div 
        className="relative overflow-hidden transition-all duration-300 group-hover:scale-105"
        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
      >
        <div className={`relative bg-gradient-to-br ${gradientFrom} ${gradientTo} border ${color.replace('border-', 'border-')}/30 p-6 sm:p-8 text-center`}>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] opacity-50"></div>
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${color.split('-')[1]}-500 to-transparent opacity-50`}></div>
          <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${color.split('-')[1]}-500 to-transparent opacity-50`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-semibold text-lg sm:text-base md:text-xl font-zentry text-gray-200 uppercase ">{title}</h2>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${gradientFrom} ${gradientTo} flex items-center justify-center border-2 ${color.replace('border-', 'border-')}/50`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-white`} />
              </div>
            </div>
            
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-custom text-white">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  const defaultAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <circle cx="64" cy="64" r="64" fill="#1F2937"/>
    <path d="M108 128C108 103.699 88.3005 84 64 84C39.6995 84 20 103.699 20 128" fill="#374151"/>
    <circle cx="64" cy="50" r="24" fill="#374151"/>
  </svg>`;

  return (
    <div className="min-h-screen  text-white mt-8 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="relative inline-block px-1 w-full group mb-6 sm:mb-8">
          <div className="absolute -top-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4 sm:group-hover:w-5 sm:group-hover:h-5"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4 sm:group-hover:w-5 sm:group-hover:h-5"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4 sm:group-hover:w-5 sm:group-hover:h-5"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-orange-500 transition-all duration-300 group-hover:w-4 group-hover:h-4 sm:group-hover:w-5 sm:group-hover:h-5"></div>

          <div 
            className="relative overflow-hidden transition-all duration-300"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
          >
            <div className="relative bg-black/40 border border-orange-500/30 p-6 sm:p-8">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] opacity-50"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group/avatar">
                    <div className="absolute -top-2 -left-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-orange-500 transition-all duration-300 group-hover/avatar:w-5 group-hover/avatar:h-5 sm:group-hover/avatar:w-8 sm:group-hover/avatar:h-8"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-orange-500 transition-all duration-300 group-hover/avatar:w-5 group-hover/avatar:h-5 sm:group-hover/avatar:w-8 sm:group-hover/avatar:h-8"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-orange-500 transition-all duration-300 group-hover/avatar:w-5 group-hover/avatar:h-5 sm:group-hover/avatar:w-8 sm:group-hover/avatar:h-8"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-orange-500 transition-all duration-300 group-hover/avatar:w-5 group-hover/avatar:h-5 sm:group-hover/avatar:w-8 sm:group-hover/avatar:h-8"></div>
                    
                    <div className="absolute inset-0 bg-orange-500/20 blur-2xl animate-pulse"></div>
                    
                    <div 
                      className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 overflow-hidden transition-all duration-300 group-hover/avatar:scale-105"
                      style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
                    >
                      <img 
                        src={user.avatar ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${user.avatar}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
                        alt={user.username} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl special-font  text-white uppercase">
                      {user.username}
                    </h2>
                  </div>
                </div>

                {/* Tournament Stats */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
                  {[
                    { count: user.tournament_stats.individual_participations, type: 'Player', Icon: User, gradientFrom: 'from-blue-400', gradientTo: 'to-blue-600', border: 'border-blue-500' },
                    { count: user.tournament_stats.team_participations, type: 'Team', Icon: Users, gradientFrom: 'from-purple-400', gradientTo: 'to-purple-600', border: 'border-purple-500' }
                  ].map(({ count, type, Icon, gradientFrom, gradientTo, border }) => (
                    <div key={type} className="relative inline-block px-1 group/stat flex-1">
                      <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 ${border} transition-all duration-300 group-hover/stat:w-3 group-hover/stat:h-3`}></div>
                      <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 ${border} transition-all duration-300 group-hover/stat:w-3 group-hover/stat:h-3`}></div>
                      
                      <div 
                        className="relative overflow-hidden transition-all duration-300 group-hover/stat:scale-105"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                      >
                        <div className="relative bg-black/30 border border-white/10 p-4 sm:p-6 text-center">
                          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
                          
                          <div className="relative z-10">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className={`text-3xl sm:text-4xl md:text-5xl font-custom bg-gradient-to-r ${gradientFrom} ${gradientTo} text-transparent bg-clip-text`}>
                              {count}
                            </div>
                            <div className="text-lg sm:text-lg font-circular-web font-bold text-gray-400 mt-1 uppercase ">
                              Tournaments as {type}
                            </div>
                            <div className="w-12 sm:w-16 h-1 bg-gray-700/50 mt-2 sm:mt-3 mx-auto rounded-full overflow-hidden">
                              <div className={`w-full h-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard 
            title="Your Rank" 
            value={user.rank || 'N/A'}
            icon={Star}
            color="border-yellow-500"
            gradientFrom="from-yellow-900/40"
            gradientTo="to-yellow-950/40"
          />
          <StatCard 
            title="Points" 
            value={user.points}
            icon={Target}
            color="border-blue-500"
            gradientFrom="from-blue-900/40"
            gradientTo="to-blue-950/40"
          />
          <StatCard 
            title="Tournament Activity" 
            value={user.tournament_stats.total_participations}
            icon={Trophy}
            color="border-green-500"
            gradientFrom="from-green-900/40"
            gradientTo="to-green-950/40"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;