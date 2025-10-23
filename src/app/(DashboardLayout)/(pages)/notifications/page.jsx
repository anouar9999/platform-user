'use client';
import React, { useState, useEffect } from 'react';
import { Zap, Trash2, Check, CheckCheck, Loader2, X, Clock, AlertCircle } from 'lucide-react';
import ScannableTitle from '@/app/(DashboardLayout)/components/ScannableTitle';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUnread = notification.is_read === '0' || notification.is_read === 0;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + 
           ' at ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getNotificationType = (message) => {
    if (message.includes('registration') || message.includes('accepted')) return { type: 'Joined New User', color: 'bg-green-500' };
    if (message.includes('message') || message.includes('sent')) return { type: 'Message', color: 'bg-orange-500' };
    if (message.includes('comment') || message.includes('commented')) return { type: 'Comment', color: 'bg-purple-500' };
    if (message.includes('team') || message.includes('join')) return { type: 'Connect', color: 'bg-blue-500' };
    if (message.includes('match') || message.includes('tournament')) return { type: 'Tournament', color: 'bg-red-500' };
    return { type: 'Update', color: 'bg-gray-500' };
  };

  const notifType = getNotificationType(notification.message);

  return (
    <div 
      className={`relative w-full mb-3 transition-all duration-200 ${isHovered ? 'scale-[1.01]' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative bg-white/5 backdrop-blur-sm border-l-4 ${isUnread ? 'border-primary bg-primary/5' : 'border-transparent'} rounded-lg overflow-hidden`}>
        <div className="relative z-10 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={() => onDelete(notification.id)}
                className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded bg-gray-700/50 hover:bg-red-500/30 flex items-center justify-center transition-colors duration-200 group/close mt-1"
                title="Delete"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/close:text-red-500 transition-colors" />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  <span className={`${notifType.color} text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded font-semibold uppercase tracking-wide flex-shrink-0`}>
                    {notifType.type}
                  </span>
                  <h3 className={`font-semibold text-sm sm:text-base ${isUnread ? 'text-white' : 'text-gray-300'} break-words`}>
                    {notification.message.split('.')[0]}
                  </h3>
                </div>
                
                <p className="text-gray-400 text-xs sm:text-sm mb-2 break-words">
                  {notification.message.split('.').slice(1).join('.').trim() || 'Stay updated with the latest information.'}
                </p>
                
                {notification.sender_name && (
                  <p className="text-primary text-xs sm:text-sm font-semibold">
                    {notification.sender_name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs whitespace-nowrap">
                  {formatTime(notification.created_at)}
                </span>
              </div>
              
              {isUnread && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-[10px] sm:text-xs text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                  title="Mark as read"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
        
        {isUnread && (
          <div className="absolute left-2 top-2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="relative w-full">
    <div className="relative overflow-hidden">
      <div className="relative z-10 text-center p-12 sm:p-20">
        <div className="inline-flex p-6 bg-white/5 rounded-full mb-6">
          <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-zentry text-gray-400 mb-2 uppercase tracking-wider">
          No Notifications
        </h3>
        <p className="text-gray-500 font-circular-web text-sm sm:text-base">
          You re all caught up! Check back later for updates.
        </p>
      </div>
    </div>
  </div>
);

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);
// In your NotificationsPage component, add this useEffect:

// In your NotificationsPage component, add this useEffect:

useEffect(() => {
  // Listen for new notification events
  const handleNotificationCreated = (event) => {
    console.log('🔔 New notification detected:', event.detail);
    
    // Refresh notifications
    fetchNotifications();
    fetchUnreadCount();
    
    // Optional: Show a toast
    showSuccess('New notification received!');
  };

  window.addEventListener('notificationCreated', handleNotificationCreated);

  return () => {
    window.removeEventListener('notificationCreated', handleNotificationCreated);
  };
}, [userId]);
  useEffect(() => {
    const localAuthData = localStorage.getItem('authData');
    if (localAuthData) {
      try {
        const parsedData = JSON.parse(localAuthData);
        console.log('Auth Data:', parsedData);
        if (parsedData.userId) {
          setUserId(parsedData.userId);
        } else {
          setError('User ID not found in authentication data');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
        setError('Authentication error');
        setIsLoading(false);
      }
    } else {
      setError('Not logged in. Please log in to view notifications.');
      setIsLoading(false);
    }
  }, []);

  const fetchNotifications = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const action = filter === 'unread' ? 'unread' : 'get';
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications.php?action=${action}&user_id=${userId}&limit=50`;
      
      console.log('Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        setNotifications(result.notifications || []);
      } else {
        setError(result.error || 'Failed to load notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to connect to server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications.php?action=count&user_id=${userId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUnreadCount(result.count || 0);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications.php?action=mark_read`;
      
      console.log('Marking as read:', { notification_id: notificationId, user_id: userId });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notification_id: notificationId,
          user_id: userId 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: '1' }
              : notif
          )
        );
        fetchUnreadCount();
        showSuccess('Notification marked as read');
      } else {
        setError(result.error || 'Failed to mark as read');
      }
    } catch (err) {
      console.error('Error marking as read:', err);
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications.php?action=mark_all_read`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchNotifications();
        fetchUnreadCount();
        showSuccess(`Marked ${result.marked_count} notification(s) as read`);
      } else {
        setError(result.error || 'Failed to mark all as read');
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError('Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications.php?action=delete`;
      
      console.log('Deleting:', { notification_id: notificationId, user_id: userId });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notification_id: notificationId,
          user_id: userId 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        fetchUnreadCount();
        showSuccess('Notification deleted');
      } else {
        setError(result.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
      
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [filter, userId]);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => n.is_read === '0' || n.is_read === 0)
    : notifications;

  return (
    <div className="bg-transparent text-white p-4 md:p-8 lg:p-12">
      <div className="mb-8">
        <ScannableTitle 
          primaryText="NOTIFICATIONS"
          secondaryText="STAY UPDATED"
        />
        <p className="text-gray-400 font-circular-web text-sm mt-4 max-w-3xl">
          View and manage your notifications. Stay informed about tournament updates, 
          team invitations, and match schedules.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/20 border-2 border-green-500/50 text-green-400 rounded flex items-center gap-2">
          <Check className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500/50 text-red-400 rounded flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="relative inline-block px-1 w-full group mb-6">
        <div 
          className="relative overflow-hidden"
          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        >
          <div className="relative bg-black/40 border-2 border-white/10 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 font-circular-web text-sm transition-all duration-300 ${
                    filter === 'all'
                      ? 'bg-primary text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 font-circular-web text-sm transition-all duration-300 ${
                    filter === 'unread'
                      ? 'bg-primary text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary transition-colors duration-200 font-circular-web text-sm"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Mark all as read</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
