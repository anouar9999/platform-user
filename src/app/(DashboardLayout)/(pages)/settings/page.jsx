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
            className="relative z-10 w-full px-4 pt-8 pb-2 bg-transparent text-white focus:outline-none transition-all duration-300 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

const UserProfileEdit = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    points: 0,
    rank: null,
    type: 'participant',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');

  // Get user ID from localStorage
  useEffect(() => {
    const localAuthData = localStorage.getItem('authData');
    if (localAuthData) {
      try {
        const parsedData = JSON.parse(localAuthData);
        if (parsedData.userId) {
          setUserId(parsedData.userId);
        }
      } catch (error) {
        console.error('Error parsing localStorage auth data:', error);
      }
    }
  }, []);

  // Listen for localStorage updates from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authData' && e.newValue) {
        try {
          const newAuthData = JSON.parse(e.newValue);
          console.log('🔄 Auth data updated from another source:', newAuthData);
          
          setProfileData(prev => ({
            ...prev,
            username: newAuthData.username || prev.username,
            email: newAuthData.email || prev.email,
            bio: newAuthData.bio || prev.bio,
            avatar: newAuthData.avatarUrl || prev.avatar,
            points: newAuthData.points || prev.points,
            rank: newAuthData.rank || prev.rank,
          }));

          if (newAuthData.avatarUrl) {
            const fullUrl = newAuthData.avatarUrl.startsWith('http')
              ? newAuthData.avatarUrl
              : `${process.env.NEXT_PUBLIC_BACKEND_URL}${newAuthData.avatarUrl}`;
            setPreviewImage(fullUrl);
          }
        } catch (err) {
          console.error('Error parsing storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_user.php?id=${userId}`);
        const result = await response.json();

        if (result.success) {
          setProfileData({
            username: result.data.username || '',
            email: result.data.email || '',
            bio: result.data.bio || '',
            avatar: result.data.avatar || '',
            points: result.data.points || 0,
            rank: result.data.rank || null,
            type: result.data.type || 'participant',
          });
          
          if (result.data.avatar) {
            setPreviewImage(process.env.NEXT_PUBLIC_BACKEND_URL + result.data.avatar);
          }
        } else {
          setErrorMessage(result.message || 'Failed to load user data');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setErrorMessage('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (eOrFile) => {
    let file = null;
    if (!eOrFile) return;
    if (eOrFile.target && eOrFile.target.files) {
      file = eOrFile.target.files[0];
    } else if (eOrFile instanceof File) {
      file = eOrFile;
    } else if (eOrFile.dataTransfer && eOrFile.dataTransfer.files) {
      file = eOrFile.dataTransfer.files[0];
    }

    if (!file) return;

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError('File is too large. Max size is 5MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    setUploadError('');
    setSelectedAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.username || profileData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!profileData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.bio && profileData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      setErrorMessage('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);

    try {
      let updatedAvatarPath = profileData.avatar;

      // Upload avatar if selected
      if (selectedAvatarFile) {
        setIsUploadingAvatar(true);
        try {
          const formData = new FormData();
          formData.append('avatar', selectedAvatarFile);
          formData.append('user_id', userId);

          const uploadResp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_user.php`, {
            method: 'POST',
            body: formData,
          });

          const uploadResult = await uploadResp.json();
          if (uploadResult.success) {
            updatedAvatarPath = uploadResult.data.avatar;
            setProfileData(prev => ({ ...prev, avatar: uploadResult.data.avatar }));
            setSelectedAvatarFile(null);
            console.log('✅ Avatar uploaded:', updatedAvatarPath);
          } else {
            setUploadError(uploadResult.message || 'Failed to upload avatar');
            setIsUploadingAvatar(false);
            setIsSaving(false);
            return;
          }
        } catch (err) {
          console.error('Error uploading avatar:', err);
          setUploadError('Failed to upload avatar. Please try again.');
          setIsUploadingAvatar(false);
          setIsSaving(false);
          return;
        } finally {
          setIsUploadingAvatar(false);
        }
      }

      // Update profile fields
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_user.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          username: profileData.username,
          email: profileData.email,
          bio: profileData.bio,
          points: profileData.points,
          rank: profileData.rank,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        
        const finalProfile = {
          ...result.data,
          avatar: updatedAvatarPath
        };
        setProfileData(finalProfile);
        
        if (updatedAvatarPath) {
          setPreviewImage(process.env.NEXT_PUBLIC_BACKEND_URL + updatedAvatarPath);
        }

        // 🔑 UPDATE LOCALSTORAGE
        try {
          console.debug('[UserProfileEdit] Profile update result:', result.data);
          const localAuthRaw = localStorage.getItem('authData');
          console.debug('[UserProfileEdit] LocalStorage before update:', localAuthRaw);
          const localAuth = localAuthRaw ? JSON.parse(localAuthRaw) : {};

          const pick = (...vals) => vals.find(v => v !== undefined && v !== null);

          const updatedAuth = {
            ...localAuth,
            username: pick(result.data?.username, profileData.username, localAuth.username),
            userType: pick(result.data?.type, profileData.type, localAuth.userType),
            avatarUrl: pick(updatedAvatarPath, result.data?.avatar, profileData.avatar, localAuth.avatarUrl),
            email: pick(result.data?.email, profileData.email, localAuth.email),
            points: pick(result.data?.points, profileData.points, localAuth.points, 0),
            rank: pick(result.data?.rank, profileData.rank, localAuth.rank),
            bio: pick(result.data?.bio, profileData.bio, localAuth.bio),
            userId: pick(result.data?.id, result.data?.userId, result.data?.user_id, userId, localAuth.userId),
            timestamp: Date.now(),
            lastUpdated: new Date().toISOString(),
          };

          localStorage.setItem('authData', JSON.stringify(updatedAuth));
          console.log('✅ LocalStorage updated successfully:', updatedAuth);

          try {
            window.dispatchEvent(new CustomEvent('authDataUpdated', { detail: updatedAuth }));
            console.log('✅ authDataUpdated event dispatched');
          } catch (evtErr) {
            console.debug('Could not dispatch authDataUpdated event', evtErr);
          }

          try {
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'authData',
              newValue: JSON.stringify(updatedAuth),
              url: window.location.href
            }));
            console.log('✅ Storage event dispatched for cross-tab sync');
          } catch (storageErr) {
            console.debug('Could not dispatch storage event', storageErr);
          }
        } catch (err) {
          console.error('❌ Failed to update localStorage authData:', err);
        }

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to connect to server');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white p-4 md:p-8 lg:p-12">
      {/* Header */}
  <ScannableTitle 
              primaryText={'EDIT PROFILE'}
              secondaryText="UPDATE YOUR INFORMATION!"
            />
      <div className="mb-8">
       
       
        <p className="text-gray-400 font-circular-web text-sm mt-4 max-w-3xl">
          Manage your account settings and preferences. Keep your information up to date to 
          connect better with your gaming community.
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/20 border-2 border-green-500/50 text-green-400 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500/50 text-red-400 rounded">
          {errorMessage}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-8 sm:mb-12">
        <div className="relative mb-4 sm:mb-6 group">
          <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-primary transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
          <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-primary transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
          <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-primary transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
          <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-primary transition-all duration-300 group-hover:w-5 group-hover:h-5 sm:group-hover:w-8 sm:group-hover:h-8"></div>
          
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
          
          <div 
            className={`relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 overflow-hidden transition-all duration-300 group-hover:scale-105 cursor-pointer ${isDragActive ? 'ring-4 ring-primary/40 scale-105' : ''}`}
            style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)' }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary/80 border-2 sm:border-4 border-primary/50 flex items-center justify-center relative">
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                  <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-primary animate-spin" />
                </div>
              )}
              
              {previewImage ? (
                <>
                  <img 
                    src={previewImage}
                    alt="Profile preview" 
                    className="w-full h-full object-cover" 
                  />
                  <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                    <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-white mb-2" />
                    <span className="text-white text-xs sm:text-sm font-semibold">Change Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={isUploadingAvatar}
                    />
                  </label>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-white mb-2" />
                  <span className="text-white text-xs sm:text-sm font-semibold">Upload Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={isUploadingAvatar}
                  />
                </label>
              )}
            </div>
            
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)] pointer-events-none"></div>
          </div>
        </div>

        <p className="text-gray-400 text-xs sm:text-sm text-center">
          {isUploadingAvatar ? 'Uploading...' : 'Click or drag & drop to upload • Max 5MB'}
        </p>
        {uploadError && (
          <p className="text-red-500 text-xs sm:text-sm text-center mt-2">{uploadError}</p>
        )}
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
  );
};

export default UserProfileEdit;
