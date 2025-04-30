import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Settings,
  Users,
  Trophy,
  Star,
  Search,
  Check,
  Trash,
  Save,
  Shield,
  AlertTriangle,
  Loader2,
  Award,
  BarChart2,
  Users2,
  Target,
  Clock,
  Medal,
  ChevronRight,
  Calendar,
  MessageCircle,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import FloatingLabelTextArea from '@/app/components/FloatingTextArea';
import FloatingLabelInput from '@/app/components/input/FloatingInput';
import FloatingSelectField from '../../components/FloatingSelectField';

// Enhanced StatCard with animations and better visual effects
const StatCard = ({ icon: Icon, value, label, trend, gradient }) => (
  <div
    className={`${gradient} relative overflow-hidden group angular-cut p-6 transition-all duration-300 hover:scale-105 shadow-lg`}
  >
    <div className="relative flex flex-col items-center">
      <div className="p-4 bg-white/10 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner">
        <Icon className="text-white" size={28} />
      </div>
      <span className="text-3xl font-bold text-white transition-all duration-300 group-hover:text-4xl">
        {value}
      </span>
      <span className="text-sm font-valorant text-gray-300 mt-1">{label}</span>
      {trend !== undefined && (
        <span
          className={`absolute top-4 right-4 text-sm font-medium ${
            trend >= 0 ? 'text-green-400' : 'text-red-400'
          } backdrop-blur-sm px-2 py-1 rounded-full bg-white/5`}
        >
          {trend > 0 && '+'}
          {trend}%
        </span>
      )}
    </div>
    {/* Decorative elements */}
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
    <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
  </div>
);

// Enhanced default avatar with better styling
const defaultAvatarSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1F2937;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="64" cy="64" r="64" fill="url(#grad)"/>
    <path d="M108 128C108 103.699 88.3005 84 64 84C39.6995 84 20 103.699 20 128" fill="#374151"/>
    <circle cx="64" cy="50" r="24" fill="#4B5563"/>
  </svg>
  `;

// Enhanced MemberCard with better visual hierarchy and micro-interactions
const MemberCard = ({ member, isOwner }) => {
  return (
    <div className="group relative bg-dark hover:bg-dark/60 backdrop-blur-sm p-3 sm:p-4 transition-all duration-300 angular-cut hover:border-primary/30 shadow-md hover:shadow-xl hover:shadow-primary/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar with glow effect */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden ">
          <img
            src={
              member.avatar
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${member.avatar}`
                : `data:image/svg+xml,${encodeURIComponent(defaultAvatarSvg)}`
            }
            alt={member.name}
            className="w-full h-full object-cover transition-all duration-50 angular-cut group-hover:scale-110 "
          />
          {isOwner && (
            <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/80 text-xs font-bold text-center py-0.5 text-yellow-900">
              OWNER
            </div>
          )}
        </div>

        {/* Member Info with better typography */}
        <div className="flex-1 min-w-0">
          <div className="font-valorant text-base sm:text-lg text-white truncate group-hover:text-primary transition-colors duration-300">
            {member.username}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-gray-700/50 angular-cut group-hover:bg-gray-700/70 text-xs sm:text-sm font-medium text-gray-300  transition-colors duration-300">
              {member.role}
            </span>

            {isOwner && (
              <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-yellow-500/10 group-hover:bg-yellow-500/20 text-xs sm:text-sm font-medium text-yellow-400 transition-colors duration-300">
                <Crown size={12} className="mr-1" />
                Team Owner
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        <button className="hidden group-hover:flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/40 text-primary transition-all duration-300 absolute top-3 right-3">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Added Crown icon component
const Crown = ({ size = 24, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 17l10-10 10 10-2 4H4l-2-4z" />
      <path d="M12 7V4" />
    </svg>
  );
};

// Enhanced RequestCard component to improve the requests section
const RequestCard = ({ request, handleRequestAction, actionLoading, defaultAvatarSvg }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-dark/40 hover:bg-dark/60 backdrop-blur-sm p-4 md:p-5 angular-cut  transition-all duration-300 shadow-md hover:shadow-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar with improved styling */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 angular-cut overflow-hidden  hover:ring-primary/40 transition-all duration-300">
            <img
              src={
                true
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${request.avatar}`
                  : `https://png.pngtree.com/png-clipart/20190903/ourmid/pngtree-vector-of-e-sports-team-logo-design-knight-armor-with-weapon-png-image_1716145.jpg`
              }
              alt={request.name}
              className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* User Info with improved typography */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <h4 className="text-base md:text-lg font-semibold uppercase font-valorant text-white hover:text-primary transition-colors duration-300">
                {request.name}
              </h4>
              <span className="px-2 md:px-3 py-1 bg-primary/10 text-xs font-medium text-primary/90 rounded-full border border-primary/20 animate-pulse">
                New Request
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gray-700/50 hover:bg-gray-700/70 text-xs font-medium text-gray-300 rounded-lg transition-colors duration-300">
                <Trophy size={12} className="mr-1" />
                {request.rank || 'Unranked'}
              </span>
              <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gray-700/50 hover:bg-gray-700/70 text-xs font-medium text-gray-300 rounded-lg transition-colors duration-300">
                <Shield size={12} className="mr-1" />
                {request.region || 'Region Unknown'}
              </span>
             
            </div>

           
          </div>

          {/* Action Buttons with animation */}
          <div className="flex gap-2 md:gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            <button
              onClick={() => handleRequestAction(request.id, 'reject')}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial px-3 md:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 angular-cut transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              ) : (
                <X className="w-4 h-4 md:w-5 md:h-5" />
              )}
              <span className="text-sm md:text-base">Decline</span>
            </button>
            <button
              onClick={() => handleRequestAction(request.id, 'accept')}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white angular-cut transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              ) : (
                <Check className="w-4 h-4 md:w-5 md:h-5" />
              )}
              <span className="text-sm md:text-base">Accept</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamSidebar = ({ isOpen, onClose, team, onTeamUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [teamSettings, setTeamSettings] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    tag: '',
    description: '',
    game_id: 1,
    division: 'Silver',
    tier: 'amateur',
    contact_email: '',
    discord: '',
    twitter: '',
  });

  const [ showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { addToast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [sidebarAnimation, setSidebarAnimation] = useState(false);
  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create FormData and upload immediately
      const formData = new FormData();
      formData.append('team_id', team.id);
      formData.append('logo', file);

      // Upload logo
      fetch(`${API_URL}/api/team_api.php?endpoint=team-settings`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            addToast({
              type: 'success',
              message: 'Logo updated successfully',
              duration: 3000,
              position: 'bottom-right',
            });
            fetchTeamData(); // Refresh data
          } else {
            throw new Error(data.message || 'Failed to update logo');
          }
        })
        .catch((error) => {
          addToast({
            type: 'error',
            message: error.message,
            duration: 5000,
            position: 'bottom-right',
          });
        });
    }
  };

  const handleBannerUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create FormData and upload immediately
      const formData = new FormData();
      formData.append('team_id', team.id);
      formData.append('banner', file);

      // Upload banner
      fetch(`${API_URL}/api/team_api.php?endpoint=team-settings`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            addToast({
              type: 'success',
              message: 'Banner updated successfully',
              duration: 3000,
              position: 'bottom-right',
            });
            fetchTeamData(); // Refresh data
          } else {
            throw new Error(data.message || 'Failed to update banner');
          }
        })
        .catch((error) => {
          addToast({
            type: 'error',
            message: error.message,
            duration: 5000,
            position: 'bottom-right',
          });
        });
    }
  };
  useEffect(() => {
    if (team) {
      setSettingsForm({
        name: team.name || '',
        tag: team.tag || '',
        description: team.description || '',
        game_id: team.game_id || 1,
        division: team.division || 'Silver',
        tier: team.tier || 'amateur',
        contact_email: team.contact_email || '',
        discord: team.discord || '',
        twitter: team.twitter || '',
      });
    }
  }, [team]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Animation delay
      setTimeout(() => setSidebarAnimation(true), 50);
    } else {
      document.body.style.overflow = 'unset';
      setSidebarAnimation(false);
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && team?.id) {
      fetchTeamData();
    }
  }, [isOpen, team?.id]);

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchConfig = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      };

      const [statsRes, membersRes, requestsRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/api/team_api.php?endpoint=team-stats&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-members&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-requests&team_id=${team.id}`, fetchConfig),
        fetch(`${API_URL}/api/team_api.php?endpoint=team-settings&team_id=${team.id}`, fetchConfig),
      ]);

      const [statsData, membersData, requestsData, settingsData] = await Promise.all([
        statsRes.json(),
        membersRes.json(),
        requestsRes.json(),
        settingsRes.json(),
      ]);
      console.log(statsData, membersData, requestsData, settingsData);

      if (!statsRes.ok || !membersRes.ok || !requestsRes.ok || !settingsRes.ok) {
        throw new Error('Failed to fetch team data');
      }

      setTeamStats(statsData.data);
      setMembers(membersData.data.members);
      setRequests(requestsData.data);
      setTeamSettings(settingsData.data);
      setSettingsForm((prev) => ({
        ...prev,
        ...settingsData.data,
      }));
    } catch (err) {
      setError('Failed to load team data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(true);
    try {
      // Map the action to the correct status expected by the API
      const apiAction = action === 'accept' ? 'accepted' : 'rejected';

      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team.id,
          request_id: requestId,
          action: apiAction, // Use the mapped action value
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} the request`);
      }

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          message: `Request ${action}ed successfully`, // Fixed grammar
          duration: 5000,
          position: 'bottom-right',
        });
        fetchTeamData();
      } else {
        throw new Error(data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      addToast({
        type: 'error',
        message: `Failed to ${action} request: ${error.message}`,
        duration: 5000,
        position: 'bottom-right',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/team_api.php?endpoint=team-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: team?.id,
          name: settingsForm.name,
          tag: settingsForm.tag,
          description: settingsForm.description,
          game_id: settingsForm.game_id,
          division: settingsForm.division,
          tier: settingsForm.tier,
          contact_email: settingsForm.contact_email,
          discord: settingsForm.discord,
          twitter: settingsForm.twitter,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          message: 'Team settings updated successfully',
          duration: 5000,
          position: 'bottom-right',
        });
        // Refresh local data
        await fetchTeamData();
        // Refresh parent component data
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      } else {
        throw new Error(result.message || 'Failed to update settings');
      }
    } catch (err) {
      setError('Failed to update settings. Please try again.');

      addToast({
        type: 'error',
        message: err.message,
        duration: 5000,
        position: 'bottom-right',
      });
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/team_api.php?endpoint=team-settings&team_id=${team.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          message: 'Team deleted successfully',
          duration: 5000,
          position: 'bottom-right',
        });
        // Close the sidebar
        onClose();
        // Refresh parent component data
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      } else {
        throw new Error(result.message || 'Failed to delete team');
      }
    } catch (err) {
      setError('Failed to delete team. Please try again.');

      addToast({
        type: 'error',
        message: err.message,
        duration: 5000,
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  const handleClose = () => {
    setSidebarAnimation(false);
    setTimeout(() => onClose(), 300); // Match transition duration
  };

  if (!isOpen) return null;

  const loadingScreen = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <div className="relative w-20 h-20">
        <div className="w-full h-full rounded-full border-4 border-primary/20 animate-ping absolute"></div>
        <div className="w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-valorant text-white">Loading team data...</p>
    </div>
  );

  const errorScreen = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <div className="p-6 bg-red-500/10 rounded-full mb-4">
        <AlertTriangle size={48} className="text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
      <p className="text-gray-400 text-center mb-6">{error}</p>
      <button
        onClick={fetchTeamData}
        className="px-6 py-3 bg-primary/60 hover:bg-primary/80 rounded-xl text-white transition-all hover:scale-105 flex items-center gap-2"
      >
        <Loader2 size={20} className="animate-spin" />
        <span>Try Again</span>
      </button>
    </div>
  );

  return (
    <>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        .angular-cut {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }

        .header-fade {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%);
          backdrop-filter: blur(10px);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }

        .slide-out {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        .modal-open {
          overflow: hidden !important;
        }

        /* Glass morphism effects */
        .glass-effect {
          background: rgba(17, 24, 39, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Custom animation for tab transitions */
        .tab-content-enter {
          opacity: 0;
          transform: translateY(8px);
        }

        .tab-content-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }

        .tab-content-exit {
          opacity: 1;
        }

        .tab-content-exit-active {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
      <style jsx>{`
        .clip-corner {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 100%, 0 50%);
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
      {/* Add this style to get the shine effect */}
      <style jsx>{`
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }

        .shine-effect {
          animation: shine 2s infinite;
        }
      `}</style>
      <div className="fixed inset-0 z-[999999999999999999]">
        {/* Backdrop with improved blur */}
        <div
          className="fixed inset-0 bg-secondary  backdrop-blur-md transition-opacity duration-300"
          style={{ opacity: sidebarAnimation ? 1 : 0 }}
          onClick={handleClose}
        />

        {/* Sidebar container with animation */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-[100%] md:max-w-full lg:max-w-full xl:max-w-full overflow-hidden ${
            sidebarAnimation ? 'slide-in' : 'slide-out'
          }`}
        >
          <div className="h-full flex flex-col bg-gradient-to-br from-secondary/90 to-secondary/90 backdrop-blur-xl shadow-xl">
            {/* Header with parallax effect */}
            <div className="sticky top-0 z-10">
              {/* Modern asymmetric header with sharp angles */}
              <div className="relative h-auto">
                {/* Background with geometric shapes */}
                <div className="absolute inset-0 overflow-hidden bg-gray-900">
                  {/* Geometric overlay pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 transform -skew-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-blue-500/10 transform skew-x-12"></div>
                    <div className="absolute top-10 left-1/4 w-16 h-16 bg-yellow-500/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-5 right-1/4 w-24 h-24 bg-green-500/20 rounded-full blur-xl"></div>
                  </div>

                  {/* Banner image with modern treatment */}
                  <div
                    className="w-full h-full bg-cover bg-center opacity-40"
                    style={{
                      backgroundImage: team?.banner
                        ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.banner})`
                        : 'url(/api/placeholder/1200/300)',
                    }}
                  ></div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-secondary/40 to-secondary/80"></div>
                </div>

                {/* Header content with modern asymmetric layout */}
                <div className="relative">
                  {/* Top section with close button and quick stats */}
                  <div className="flex items-center justify-between px-4 pt-3">
                    <div className="flex items-center space-x-3">
                      <div className="px-3 py-1 bg-gray-800/70 backdrop-blur-sm rounded-md border-l-2 border-primary flex items-center">
                        <Users size={14} className="text-primary mr-1.5" />
                        <span className="text-xs font-medium text-gray-300">
                          {team?.total_members || 0}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-gray-800/70 backdrop-blur-sm rounded-md border-l-2 border-yellow-500 flex items-center">
                        <Trophy size={14} className="text-yellow-500 mr-1.5" />
                        <span className="text-xs font-medium text-gray-300">
                          Div {team?.division || '-'}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-gray-800/70 backdrop-blur-sm rounded-md border-l-2 border-blue-500 flex items-center">
                        <Star size={14} className="text-blue-500 mr-1.5" />
                        <span className="text-xs font-medium text-gray-300">
                          Rank #{teamStats?.regional_rank || '-'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      className="p-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm rounded-md transition-all"
                      aria-label="Close sidebar"
                    >
                      <X size={18} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>

                  {/* Main content with team info and logo */}
                  <div className="px-6 py-5 flex flex-col md:flex-row md:items-end justify-between">
                    <div className="flex items-start gap-5">
                      {/* Team logo with modern frame */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600 rotate-6 rounded-md blur-sm opacity-70"></div>
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden border-2 border-gray-700 shadow-lg transform hover:-rotate-2 transition-transform duration-300 z-10">
                          <img
                            src={
                              team?.logo
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${team.logo}`
                                : '/api/placeholder/112/112'
                            }
                            alt={team?.name || 'Team logo'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        </div>
                        {/* Decorative corner accent */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary clip-corner"></div>
                      </div>

                      {/* Team name and info */}
                      <div>
                        <div className="flex flex-col">
                          <span className="text-xs text-primary font-mono tracking-wider uppercase mb-1">
                            TEAM PROFILE
                          </span>
                          <h2 className="text-2xl md:text-3xl font-custom tracking-wider text-white  flex items-center">
                            {team?.name}
                            {team?.verified && (
                              <span className="ml-2 text-yellow-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </h2>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {team?.description || 'No team description available.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons in a vertical stack */}
                  </div>

                  {/* Bottom navigation/tab indicators */}
                  <div className="px-6 pt-3 pb-0 flex justify-between items-center border-b border-gray-800/70">
                    <div className="flex space-x-1">
                      {['overview', 'members', 'requests', 'settings'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                            activeTab === tab
                              ? 'border-primary text-primary'
                              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content with loading and error states */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
              {loading ? (
                loadingScreen
              ) : error ? (
                errorScreen
              ) : (
                <div className="space-y-6 md:space-y-8 font-pilot">
                  {activeTab === 'overview' && (
                    <div className="space-y-6 md:space-y-8 animate-fadeIn">
                      {/* Stats Cards aligned with database fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatCard
                          icon={Users2}
                          value={teamStats?.total_members || 0}
                          label="Total Members"
                          gradient="bg-gradient-to-br from-purple-600/30 to-blue-600/30"
                        />
                        <StatCard
                          icon={Target}
                          value={`${teamStats?.win_rate || 0}%`}
                          label="Win Rate"
                          gradient="bg-gradient-to-br from-green-600/30 to-emerald-600/30"
                        />
                        <StatCard
                          icon={Trophy}
                          value={teamStats?.wins || 0}
                          label="Wins"
                          gradient="bg-gradient-to-br from-yellow-600/30 to-orange-600/30"
                        />
                        <StatCard
                          icon={X}
                          value={teamStats?.losses || 0}
                          label="Losses"
                          gradient="bg-gradient-to-br from-red-600/30 to-pink-600/30"
                        />
                      </div>

                      {/* Info Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-dark/40 hover:bg-dark/60 angular-cut p-6 transition-all duration-300 hover:border-primary/30 group">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors duration-300">
                              <Star className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-400">Team Tier</div>
                              <div className="text-2xl font-valorant text-white mt-2 group-hover:text-primary transition-colors duration-300">
                                {(teamStats?.tier &&
                                  teamStats.tier.charAt(0).toUpperCase() +
                                    teamStats.tier.slice(1)) ||
                                  'Amateur'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-dark/40 hover:bg-dark/60 angular-cut p-6 transition-all duration-300 hover:border-yellow-500/30 group">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition-colors duration-300">
                              <Medal className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-400">Division</div>
                              <div className="text-2xl font-valorant text-white mt-2 group-hover:text-yellow-400 transition-colors duration-300">
                                {(teamStats?.division &&
                                  teamStats.division.charAt(0).toUpperCase() +
                                    teamStats.division.slice(1)) ||
                                  'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Team Social Links - if available */}
                      {(teamStats?.discord || teamStats?.twitter || teamStats?.contact_email) && (
                        <div className="bg-gradient-to-br from-secondary/50 to-secondary/50 backdrop-blur-md shadow-lg shadow-purple-900/5 overflow-hidden transition-all duration-300 hover:border-gray-600/50 group">
                          <div className="relative">
                            {/* Decorative top gradient bar */}

                            {/* Header */}
                            <div className="p-6 pb-4 ">
                              <h3 className="text-lg font-valorant text-primary flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 "
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                                Social Link
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                Reach out to our team through our social channels
                              </p>
                            </div>

                            {/* Social links container */}
                            <div className="p-6 pt-5">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {teamStats?.discord && (
                                  <a
                                    href={
                                      teamStats.discord.startsWith('http')
                                        ? teamStats.discord
                                        : `https://discord.gg/${teamStats.discord}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative overflow-hidden flex items-center  transition-all duration-300 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 angular-cut group-hover:shadow-md"
                                  >
                                    {/* Hover gradient effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/0 group-hover:via-indigo-500/10 group-hover:to-indigo-500/0 transition-all duration-700"></div>

                                    <div className="flex items-center gap-3 p-4 relative z-10">
                                      <div className="p-2 rounded-lg shadow-md  backdrop-blur-sm">
                                        <svg
                                          className="w-5 h-5 text-indigo-400"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                        </svg>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-white font-medium text-sm">
                                          Discord
                                        </span>
                                        <span className="text-xs text-indigo-300 truncate max-w-xs">
                                          Join our server
                                        </span>
                                      </div>
                                    </div>
                                    {/* Arrow indicator on hover */}
                                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <svg
                                        className="w-4 h-4 text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 5l7 7-7 7"
                                        ></path>
                                      </svg>
                                    </div>
                                  </a>
                                )}

                                {teamStats?.twitter && (
                                  <a
                                    href={
                                      teamStats.twitter.startsWith('http')
                                        ? teamStats.twitter
                                        : `https://twitter.com/${teamStats.twitter}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative overflow-hidden flex items-center angular-cut transition-all duration-300 bg-gradient-to-br from-blue-500/5 to-blue-600/10 group-hover:shadow-md"
                                  >
                                    {/* Hover gradient effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/0 group-hover:via-blue-500/10 group-hover:to-blue-500/0 transition-all duration-700"></div>

                                    <div className="flex items-center gap-3 p-4 relative z-10">
                                      <div className="p-2 rounded-lg shadow-md bg-blue-500/20 backdrop-blur-sm">
                                        <svg
                                          className="w-5 h-5 text-blue-400"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-white font-medium text-sm">
                                          Twitter
                                        </span>
                                        <span className="text-xs text-blue-300 truncate max-w-xs">
                                          @
                                          {teamStats.twitter
                                            .replace(/^https?:\/\/(www\.)?twitter\.com\//, '')
                                            .replace(/\/.*$/, '')}
                                        </span>
                                      </div>
                                    </div>
                                    {/* Arrow indicator on hover */}
                                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <svg
                                        className="w-4 h-4 text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 5l7 7-7 7"
                                        ></path>
                                      </svg>
                                    </div>
                                  </a>
                                )}

                                {teamStats?.contact_email && (
                                  <a
                                    href={`mailto:${teamStats.contact_email}`}
                                    className="relative overflow-hidden flex items-center angular-cut transition-all duration-300 bg-gradient-to-br from-green-500/5 to-green-600/10  group-hover:shadow-md"
                                  >
                                    {/* Hover gradient effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/0 group-hover:via-green-500/10 group-hover:to-green-500/0 transition-all duration-700"></div>

                                    <div className="flex items-center gap-3 p-4 relative z-10">
                                      <div className="p-2 rounded-lg shadow-md bg-green-500/20 backdrop-blur-sm">
                                        <svg
                                          className="w-5 h-5 text-green-400"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                          <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-white font-medium text-sm">
                                          Email
                                        </span>
                                        <span className="text-xs text-green-300 truncate max-w-xs">
                                          {teamStats.contact_email.length > 20
                                            ? teamStats.contact_email.substring(0, 20) + '...'
                                            : teamStats.contact_email}
                                        </span>
                                      </div>
                                    </div>
                                    {/* Arrow indicator on hover */}
                                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <svg
                                        className="w-4 h-4 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 5l7 7-7 7"
                                        ></path>
                                      </svg>
                                    </div>
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Decorative background elements */}
                            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'members' && (
                    <div className="space-y-6 md:space-y-8 animate-fadeIn">
                      {/* Search bar with improved styling */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                          <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark/50  angular-cut pl-12 pr-4 py-3 md:py-4 text-white focus:outline-none "
                          />
                        </div>

                        {/* Add member button */}
                        {/* <button className="px-5 py-3 md:py-4 bg-primary/80 hover:bg-primary rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-primary/20">
                          <UserPlus size={20} />
                          <span>Add Member</span>
                        </button> */}
                      </div>

                      {/* Team leaders section */}
                      {/* <div>
                        <h3 className="text-lg font-valorant text-white mb-4 flex items-center">
                          <Crown size={20} className="mr-2 text-yellow-400" /> Team Leadership
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          {members
                            .filter(
                              (member) =>
                                member.user_id === team?.owner_id ||
                                member.role.toLowerCase().includes('leader'),
                            )
                            .map((member) => (
                              <MemberCard
                                key={member.id}
                                member={member}
                                isOwner={member.user_id === team?.owner_id}
                              />
                            ))}
                        </div>
                      </div> */}

                      {/* All members section */}
                      <div className="">
                        <h3 className="text-lg font-valorant text-primary mb-4 flex items-center">
                          <Users size={20} className="mr-2" /> All Members
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {members.map((member) => (
                            <MemberCard
                              key={member.id}
                              member={member}
                              isOwner={member.user_id === team?.owner_id}
                            />
                          ))}
                        </div>
                      </div>

                      {members.length === 0 && (
                        <div className="text-center py-16 px-4 bg-secondary/20 backdrop-blur-sm rounded-xl border border-gray-700/30">
                          <Users className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                          <p className="text-xl font-valorant text-white mb-2">No members found</p>
                          <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Add some members to your team to get started
                          </p>
                          <button className="px-6 py-3 bg-primary/70 hover:bg-primary rounded-lg text-white inline-flex items-center justify-center gap-2 transition-all hover:scale-105">
                            <UserPlus size={20} />
                            <span>Add First Member</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'requests' && (
                    <div className="space-y-6 md:space-y-8 animate-fadeIn">
                      {/* Header with Stats */}
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-dark  p-5 md:p-6  angular-cut transition-all duration-300">
                          <div className="flex items-center gap-4 text-primary/90">
                            <div className="p-3 rounded-xl bg-primary/10">
                              <UserPlus className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <div>
                              <h3 className="text-xl tracking-wider font-custom  text-gray-400">
                                Pending Requests
                              </h3>
                              <p className="text-2xl md:text-3xl font-bold text-white">
                                {requests.length}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-dark backdrop-blur-sm p-5 md:p-6 angular-cut  hover:border-green-500/30 transition-all duration-300">
                          <div className="flex items-center gap-4 text-emerald-500">
                            <div className="p-3 rounded-xl bg-emerald-500/10">
                              <Check className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <div>
                              <h3 className="text-xl tracking-wider font-custom text-gray-400">Accepted Today</h3>
                              <p className="text-2xl md:text-3xl font-bold text-white">0</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Requests List */}
                      <div className="flex flex-col grid-cols-2 gap-4">
                        {requests.map((request) => (
                        
                        <>
                        <RequestCard
                            key={request.id}
                            request={request}
                            handleRequestAction={handleRequestAction}
                            actionLoading={actionLoading}
                            defaultAvatarSvg={defaultAvatarSvg}
                          />
                        </>
                        
                        ))}

                        {requests.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-16 px-4 bg-secondary/20 backdrop-blur-sm  ">
                            <UserPlus className="w-16 h-16 text-gray-500 mb-4" />
                            <h3 className="text-xl font-valorant text-white mb-2">
                              No Pending Requests
                            </h3>
                            <p className="text-gray-400 text-center max-w-md mb-6">
                              When players request to join your team, they will appear here for
                              review.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-8 md:space-y-10 animate-fadeIn">
                      <div className="w-full mx-auto">
                        <form onSubmit={handleSettingsSubmit} className="space-y-8">
                          {/* Team information section with improved card design */}
                          <div className="bg-secondary/30 rounded-xl p-6   relative overflow-hidden group">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-50 transform translate-x-20 -translate-y-20 group-hover:opacity-70 transition-opacity duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl opacity-50 transform -translate-x-20 translate-y-20 group-hover:opacity-70 transition-opacity duration-700"></div>

                            {/* Section header with icon and improved typography */}
                            <div className="relative mb-8">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                  <Settings size={22} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-valorant text-white">
                                  Team Information
                                </h3>
                              </div>
                              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full"></div>
                            </div>

                            <div className="space-y-8 relative z-10">
                              {/* Name and Tag with improved layout */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group/field">
                                  <FloatingLabelInput
                                    label="Team Name"
                                    name="name"
                                    value={settingsForm.name}
                                    onChange={(e) =>
                                      setSettingsForm({ ...settingsForm, name: e.target.value })
                                    }
                                    className="bg-gray-800/70 border-gray-700/50 focus:border-primary/70 transition-all duration-300 group-hover/field:border-gray-600/70"
                                  />
                                  <p className="text-xs text-gray-500 mt-2 ml-2 group-hover/field:text-gray-400 transition-colors">
                                    Your teams full name
                                  </p>
                                </div>

                                <div className="group/field">
                                  <FloatingLabelInput
                                    label="Team Tag"
                                    name="tag"
                                    value={settingsForm.tag}
                                    onChange={(e) =>
                                      setSettingsForm({ ...settingsForm, tag: e.target.value })
                                    }
                                    className="bg-gray-800/70 border-gray-700/50 focus:border-primary/70 transition-all duration-300 group-hover/field:border-gray-600/70"
                                    maxLength={10}
                                  />
                                  <p className="text-xs text-gray-500 mt-2 ml-2 group-hover/field:text-gray-400 transition-colors">
                                    Short tag (max 10 characters)
                                  </p>
                                </div>
                              </div>

                              {/* Description with improved styling */}
                              <div className="group/field">
                                <FloatingLabelTextArea
                                  label="Team Description"
                                  name="description"
                                  value={settingsForm.description}
                                  onChange={(e) =>
                                    setSettingsForm({
                                      ...settingsForm,
                                      description: e.target.value,
                                    })
                                  }
                                  className="bg-gray-800/70 border-gray-700/50 focus:border-primary/70 transition-all duration-300 group-hover/field:border-gray-600/70"
                                  rows={4}
                                />
                                <p className="text-xs text-gray-500 mt-2 ml-2 group-hover/field:text-gray-400 transition-colors">
                                  Tell others about your team, goals and achievements
                                </p>
                              </div>

                              {/* Social Media with improved styling */}
                              <div>
                                <h4 className="text-base font-medium text-gray-300 mb-4 flex items-center">
                                  <MessageCircle size={16} className="mr-2 text-emerald-500" />{' '}
                                  Social Media
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="group/field">
                                    <FloatingLabelInput
                                      label="Contact Email"
                                      name="contact_email"
                                      value={settingsForm.contact_email}
                                      onChange={(e) =>
                                        setSettingsForm({
                                          ...settingsForm,
                                          contact_email: e.target.value,
                                        })
                                      }
                                      className="bg-gray-800/70 border-gray-700/50 focus:border-primary/70 transition-all duration-300 group-hover/field:border-gray-600/70"
                                    />
                                    <p className="text-xs text-gray-500 mt-2 ml-2 group-hover/field:text-gray-400 transition-colors">
                                      Public contact email for your team
                                    </p>
                                  </div>
                                  <div className="group/field">
                                    <FloatingLabelInput
                                      label="Discord"
                                      name="discord"
                                      value={settingsForm.discord}
                                      onChange={(e) =>
                                        setSettingsForm({
                                          ...settingsForm,
                                          discord: e.target.value,
                                        })
                                      }
                                      className="bg-gray-800/70 border-gray-700/50 focus:border-primary/70 pl-10 transition-all duration-300 group-hover/field:border-gray-600/70"
                                    />
                                    <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-indigo-400"></div>
                                    <p className="text-xs text-gray-500 mt-2 ml-2 group-hover/field:text-gray-400 transition-colors">
                                      Team Discord server or invite link
                                    </p>
                                  </div>

                                  <div className="group/field">
                                    <FloatingLabelInput
                                      label="Twitter/X"
                                      name="twitter"
                                      value={settingsForm.twitter}
                                      onChange={(e) =>
                                        setSettingsForm({
                                          ...settingsForm,
                                          twitter: e.target.value,
                                        })
                                      }
                                      className="bg-gray-800/70 border-gray-700/50 focus:border-primary/70 pl-10 transition-all duration-300 group-hover/field:border-gray-600/70"
                                    />
                                    <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-400"></div>
                                    <p className="text-xs text-gray-500 mt-2 ml-2 group-hover/field:text-gray-400 transition-colors">
                                      Teams Twitter/X handle (@username)
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Media upload section with improved styling */}
                          <div className="bg-secondary/30 rounded-xl p-6  shadow-xl relative overflow-hidden group">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-dark/5 rounded-full blur-3xl opacity-50 transform translate-x-20 -translate-y-20 group-hover:opacity-70 transition-opacity duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-dark/5 rounded-full blur-3xl opacity-50 transform -translate-x-20 translate-y-20 group-hover:opacity-70 transition-opacity duration-700"></div>

                            {/* Section header with icon and improved typography */}
                            <div className="relative mb-8">
                              <div className="flex items-center gap-3 mb-3  text-primary">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                  <Image size={22} />
                                </div>
                                <h3 className="text-xl font-valorant ">Team Media</h3>
                              </div>
                              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                              {/* Team Logo with enhanced styling */}
                              <div className="space-y-4 group/logo">
                                <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="text-blue-400"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Team Logo
                                </label>
                                <div className="flex items-center justify-center w-full">
                                  <label className="relative flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-500/60 transition-all duration-300 cursor-pointer bg-gray-800/30 group-hover/logo:shadow-lg group-hover/logo:shadow-blue-500/10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-dark/5 to-purple-500/5 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                                    <div className="flex flex-col items-center justify-center p-6 relative z-10">
                                      <div className="w-24 h-24 mb-4 rounded-xl border-2 border-gray-700 overflow-hidden group-hover/logo:border-blue-600/30 transition-colors duration-300 relative">
                                        <img
                                          src={
                                            team?.logo
                                              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`
                                              : `data:image/svg+xml,${encodeURIComponent(
                                                  defaultAvatarSvg,
                                                )}`
                                          }
                                          alt="Team logo preview"
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover/logo:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity"></div>
                                      </div>
                                      <p className="text-sm text-gray-400 group-hover/logo:text-blue-400 transition-colors duration-300">
                                        Click to upload new logo
                                      </p>
                                    </div>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={handleLogoUpload}
                                      accept="image/*"
                                    />
                                  </label>
                                </div>
                              </div>

                              {/* Team Banner with enhanced styling */}
                              <div className="space-y-4 group/banner">
                                <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="text-purple-400"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                  </svg>
                                  Team Banner
                                </label>
                                <div className="flex items-center justify-center w-full">
                                  <label className="relative flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500/60 transition-all duration-300 cursor-pointer bg-gray-800/30 group-hover/banner:shadow-lg group-hover/banner:shadow-purple-500/10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                                    <div className="flex flex-col items-center justify-center p-6 relative z-10">
                                      <div
                                        className="w-full h-24 mb-4 rounded-xl border-2 border-gray-700 bg-cover bg-center group-hover/banner:border-purple-600/30 transition-colors duration-300 relative overflow-hidden"
                                        style={{
                                          backgroundImage: team?.banner
                                            ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${team.banner})`
                                            : 'url(/api/placeholder/400/200)',
                                        }}
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/banner:opacity-100 transition-opacity"></div>
                                      </div>
                                      <p className="text-sm text-gray-400 group-hover/banner:text-purple-400 transition-colors duration-300">
                                        Click to upload new banner
                                      </p>
                                    </div>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={handleBannerUpload}
                                      accept="image/*"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Form actions with improved styling */}
                          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-800/50">
                            <button
                              type="button"
                              onClick={() => setShowDeleteConfirm(true)}
                              className="group px-5 py-3 bg-red-500/10 hover:bg-red-500/20 angular-cut text-red-400 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 relative overflow-hidden"
                            >
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 shine-effect opacity-0 group-hover:opacity-100"></span>
                              <Trash className="w-5 h-5 relative z-10" />
                              <span className="relative z-10">Delete Team</span>
                            </button>

                            <button
                              type="submit"
                              className="group px-6 py-3 bg-primary hover:from-primary hover:to-purple-600 angular-cut text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/20 relative overflow-hidden"
                            >
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 shine-effect opacity-0 group-hover:opacity-100"></span>
                              <Save size={20} className="relative z-10" />
                              <span className="relative z-10">Save Changes</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal with enhanced styling */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[99999999999999999999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800  p-6 md:p-8 w-full max-w-md angular-cut shadow-2xl shadow-red-500/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-500/20 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl tracking-wider font-custom text-white">Delete Team</h3>
                <p className="text-gray-400 mt-1 font-mono">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-gray-300 mb-8 bg-red-500/5 p-4  border border-red-500/20">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">{team?.name}</span>? All team data,
              including members and history, will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-3 text-gray-400 font-valorant hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteTeam();
                  setShowDeleteConfirm(false);
                }}
                className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 angular-cut text-white transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Trash className="w-5 h-5" />
                <span className='font-valorant'>Delete Team</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Added Image icon component
const Image = ({ size = 24, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
};

export default TeamSidebar;
