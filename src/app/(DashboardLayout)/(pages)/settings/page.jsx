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

  // Move localStorage to useEffect
  useEffect(() => {
    // Get userId from localStorage after component mounts (client-side only)
    const id = localStorage.getItem('userId');
    setUserId(id);
    
    if (id) fetchUserSettings(id);
  }, []);

  const fetchUserSettings = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_settings.php?id=${id}`);
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

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-dark/50  p-4 sm:p-6 hover:bg-dark/70 transition-all">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="font-semibold text-lg sm:text-2xl font-valorant text-gray-200">{title}</h2>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
      </div>
      
      <div className="relative w-full aspect-square max-w-[12rem] mx-auto mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl sm:text-6xl lg:text-8xl font-custom text-primary">{value}</div>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const defaultAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <circle cx="64" cy="64" r="64" fill="#1F2937"/>
    <path d="M108 128C108 103.699 88.3005 84 64 84C39.6995 84 20 103.699 20 128" fill="#374151"/>
    <circle cx="64" cy="50" r="24" fill="#374151"/>
  </svg>`;

  return (
    <div className="min-h-screen bg-secondary mt-8 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-dark/30  p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 sm:justify-around">
            <div className="flex flex-col items-center gap-4 sm:gap-8">
              <div className="relative group">
                <div className="absolute inset-0 blur-xl group-hover:blur-2xl transition-all" />
                <img 
                  src={user.avatar ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.avatar}` : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`}
                  alt={user.username} 
                  style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}
                  className="w-24 h-24 sm:w-32 sm:h-32 relative transition-all duration-300 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h2 className="text-2xl sm:text-3xl font-custom tracking-wider text-white">
                    {user.username}
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full sm:w-auto">
              {[
                { count: user.tournament_stats.individual_participations, type: 'Player', Icon: User, color: 'from-blue-400 to-blue-600' },
                { count: user.tournament_stats.team_participations, type: 'Team', Icon: Users, color: 'from-purple-400 to-purple-600' }
              ].map(({ count, type, Icon, color }) => (
                <div key={type} className="text-center bg-dark/30 p-4 sm:p-6 rounded-xl hover:bg-gray-800/50 transition-all flex-1 sm:flex-none">
                  <div className={`text-3xl sm:text-5xl font-custom bg-gradient-to-r ${color} text-transparent bg-clip-text`}>
                    {count}
                  </div>
                  <div className="text-xs sm:text-sm font-valorant text-gray-400 mt-1">
                    Tournaments as {type}
                  </div>
                  <div className="w-12 sm:w-16 h-1 bg-gray-700/50 mt-2 sm:mt-3 mx-auto rounded-full overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-r ${color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard 
            title="Your Rank" 
            value={user.rank || 'N/A'}
            icon={Star}
            color="text-yellow-500"
          />
          <StatCard 
            title="Points" 
            value={user.points}
            icon={Target}
            color="text-blue-500"
          />
          <StatCard 
            title="Tournament Activity" 
            value={user.tournament_stats.total_participations}
            icon={Trophy}
            color="text-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;