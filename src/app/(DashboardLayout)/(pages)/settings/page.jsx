'use client';
import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, Loader2 } from 'lucide-react';
import ScannableTitle from '../../components/ScannableTitle';

const FuturisticInput = ({ label, icon: Icon, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value !== '');

  return (
    <div className="relative inline-block px-1 w-full group mb-1">
      <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
        error ? 'border-red-500' : isFocused ? 'border-primary' : 'border-transparent'
      }`}></div>
      <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
        error ? 'border-red-500' : isFocused ? 'border-primary' : 'border-transparent'
      }`}></div>

      <div 
        className="relative overflow-hidden transition-all duration-300"
        style={{ 
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          transform: isFocused ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        <div className={`relative transition-all duration-300 ${
          error 
            ? 'bg-red-900/20 border-2 border-red-500/50' 
            : isFocused
            ? 'bg-black/60 border-2 border-primary/50'
            : 'bg-black/40 border-2 border-white/10'
        }`}>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50 pointer-events-none"></div>
          
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>
          
          {Icon && (
            <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-primary' : 'text-gray-500'
            }`} />
          )}
          
          <label className={`absolute ${Icon ? 'left-12' : 'left-4'} text-gray-500 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue 
              ? 'top-2 text-xs text-primary font-zentry tracking-wider' 
              : 'top-1/2 -translate-y-1/2 text-sm'
          }`}>
            {label}
          </label>

          <input
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(e.target.value !== '');
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(e.target.value !== '');
              props.onChange?.(e);
            }}
            className={`relative z-10 w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 pt-6 pb-2 bg-transparent font-circular-web text-white focus:outline-none transition-all duration-300`}
          />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>
      )}
    </div>
  );
};

const FuturisticTextarea = ({ label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value !== '');

  return (
    <div className="relative inline-block px-1 w-full group mb-1">
      <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
        isFocused ? 'border-primary' : 'border-transparent'
      }`}></div>
      <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
        isFocused ? 'border-primary' : 'border-transparent'
      }`}></div>

      <div 
        className="relative overflow-hidden transition-all duration-300"
        style={{ 
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          transform: isFocused ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        <div className={`relative transition-all duration-300 ${
          isFocused
            ? 'bg-black/60 border-2 border-primary/50'
            : 'bg-black/40 border-2 border-white/10'
        }`}>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50 pointer-events-none"></div>
          
          <label className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue 
              ? 'top-2 text-xs text-primary' 
              : 'top-4 text-sm'
          }`}>
            {label}
          </label>

          <textarea
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(e.target.value !== '');
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(e.target.value !== '');
              props.onChange?.(e);
            }}
            className="relative z-10 w-full pl-4 pr-4 pt-8 pb-2 bg-transparent font-circular-web text-white focus:outline-none transition-all duration-300 resize-none"
          />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>
      )}
    </div>
  );
};

const UserProfileEdit = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: null,
    points: 0,
    rank: null
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data) {
        setProfileData({
          username: data.username || '',
          email: data.email || '',
          bio: data.bio || '',
          avatar: data.avatar || null,
          points: data.points || 0,
          rank: data.rank || null
        });
        
        if (data.avatar) {
          setPreviewUrl(data.avatar);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Image size must be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        handleChange('avatar', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.username || profileData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!profileData.email || !/^\S+@\S+\.\S+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.bio && profileData.bio.length > 500) {
      newErrors.bio = 'Bio must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('username', profileData.username);
      formData.append('email', profileData.email);
      formData.append('bio', profileData.bio);
      
      if (profileData.rank !== null) {
        formData.append('rank', profileData.rank);
      }
      
      if (profileData.avatar instanceof File) {
        formData.append('avatar', profileData.avatar);
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        console.log('Profile updated successfully');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative inline-block px-1 w-full group mb-12">
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
          
          <div 
            className="relative overflow-hidden"
            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
          >
            <div className="relative border-2 border-primary/50 p-8 bg-gradient-to-br from-black/80 to-black/60">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]"></div>
              <ScannableTitle 
                title="Edit Profile" 
                className="relative z-10 text-4xl md:text-5xl font-zentry text-primary"
              />
            </div>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="relative inline-block px-1 w-full group mb-8">
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary"></div>
          
          <div 
            className="relative overflow-hidden"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
          >
            <div className="relative border-2 border-gray-800 p-6">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
              
              <h2 className="relative z-10 text-2xl font-zentry text-primary mb-6 uppercase tracking-wider">Profile Picture</h2>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 transition-all duration-300 group-hover:border-primary">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <User size={48} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary hover:bg-primary/80 rounded-full p-2 cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <Camera size={20} className="text-black" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-2">
                    Upload a profile picture (Max 5MB)
                  </p>
                  <p className="text-gray-500 text-xs">
                    Supported formats: JPG, PNG, GIF
                  </p>
                  {errors.avatar && (
                    <p className="text-red-500 text-xs mt-2">{errors.avatar}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="relative inline-block px-1 w-full group mb-8">
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary"></div>
          
          <div 
            className="relative overflow-hidden"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
          >
            <div className="relative border-2 border-gray-800 p-6">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50"></div>
              
              <h2 className="relative z-10 text-2xl font-zentry text-primary mb-6 uppercase tracking-wider">Basic Information</h2>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <FuturisticInput
                  label="Username"
                  icon={User}
                  value={profileData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  error={errors.username}
                />

                <FuturisticInput
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                />

                <FuturisticInput
                  label="Points"
                  type="number"
                  value={profileData.points}
                  onChange={(e) => handleChange('points', parseInt(e.target.value) || 0)}
                  disabled
                />

                <FuturisticInput
                  label="Rank"
                  type="number"
                  value={profileData.rank || ''}
                  onChange={(e) => handleChange('rank', parseInt(e.target.value) || null)}
                />

                <div className="md:col-span-2">
                  <FuturisticTextarea
                    label="Bio"
                    value={profileData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={4}
                    maxLength={500}
                    error={errors.bio}
                  />
                  <p className="text-gray-500 text-xs mt-2 ml-2">
                    {profileData.bio?.length || 0}/500 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <div className="relative inline-block px-1 w-full sm:w-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary rounded blur opacity-75"></div>
            <div 
              className="relative overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
            >
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="relative w-full bg-gradient-to-r from-primary to-primary text-black px-8 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] opacity-50"></div>
                {isSaving ? (
                  <>
                    <Loader2 size={20} className="relative z-10 animate-spin" />
                    <span className="relative z-10 font-bold uppercase tracking-wider">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} className="relative z-10" />
                    <span className="relative z-10 font-bold uppercase tracking-wider">Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEdit;