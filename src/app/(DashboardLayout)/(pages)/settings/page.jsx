"use client"
import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, Loader2 } from 'lucide-react';

const FuturisticInput = ({ label, icon: Icon, error, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full mb-4">
      <div className={`relative border-2 transition-all ${
        error ? 'border-red-500' : focused ? 'border-purple-500' : 'border-gray-700'
      } bg-black/40 rounded-lg`}>
        {Icon && <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${focused ? 'text-purple-500' : 'text-gray-500'}`} />}
        
        <input
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-transparent text-white focus:outline-none`}
          placeholder={label}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>}
    </div>
  );
};

const FuturisticTextarea = ({ label, error, ...props }) => {
  return (
    <div className="relative w-full mb-4">
      <textarea
        {...props}
        className="w-full p-4 bg-black/40 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white focus:outline-none resize-none transition-all"
        placeholder={label}
      />
      {error && <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>}
    </div>
  );
};

export default function UserProfileEdit() {
  const [profile, setProfile] = useState({
    username: '', email: '', bio: '', avatar: '', points: 0, rank: null
  });
  const [preview, setPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userId, setUserId] = useState(null);
  const [showDebug, setShowDebug] = useState(false); // Debug mode toggle

  // Get user ID from localStorage
  useEffect(() => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        const { userId: id } = JSON.parse(authData);
        setUserId(id);
      } catch (err) {
        console.error('Auth data parse error:', err);
      }
    }
  }, []);

  // Listen for localStorage updates from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authData' && e.newValue) {
        try {
          const newAuthData = JSON.parse(e.newValue);
          console.log('Auth data updated from another source:', newAuthData);
          
          // Update local state to reflect changes
          setProfile(prev => ({
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
            setPreview(fullUrl);
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
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_user.php?id=${userId}`);
        const data = await res.json();
        
        if (data.success) {
          setProfile(data.data);
          if (data.data.avatar) {
            setPreview(process.env.NEXT_PUBLIC_BACKEND_URL + data.data.avatar);
          }
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File too large (max 5MB)' });
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!profile.username || profile.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Invalid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!userId) {
      setMessage({ type: 'error', text: 'User ID not found' });
      return;
    }

    if (!validate()) {
      setMessage({ type: 'error', text: 'Please fix errors' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let updatedAvatarPath = profile.avatar;

      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        formData.append('user_id', userId);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_user.php`, {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          setMessage({ type: 'error', text: uploadData.message });
          setSaving(false);
          return;
        }
        
        // Store the new avatar path
        updatedAvatarPath = uploadData.data.avatar;
        setAvatarFile(null);
      }

      // Update profile fields (only if there are non-avatar changes OR no avatar was uploaded)
      if (!avatarFile || profile.username || profile.email || profile.bio) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_user.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            username: profile.username,
            email: profile.email,
            bio: profile.bio,
            points: profile.points,
            rank: profile.rank,
          }),
        });

        const data = await res.json();
        
        if (data.success) {
          setMessage({ type: 'success', text: 'Profile updated!' });
          
          // Update profile state with latest data
          const finalProfile = {
            ...data.data,
            avatar: updatedAvatarPath // Ensure avatar is preserved
          };
          setProfile(finalProfile);
          
          // Update preview with new avatar
          if (updatedAvatarPath) {
            setPreview(process.env.NEXT_PUBLIC_BACKEND_URL + updatedAvatarPath);
          }
          
          // Update localStorage
          const authData = JSON.parse(localStorage.getItem('authData') || '{}');
          const updated = {
            ...authData,
            username: finalProfile.username,
            email: finalProfile.email,
            avatarUrl: updatedAvatarPath,
            points: finalProfile.points,
          };
          localStorage.setItem('authData', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('authDataUpdated', { detail: updated }));
          
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } else {
        // Only avatar was uploaded, no other fields changed
        setMessage({ type: 'success', text: 'Avatar updated!' });
        
        const finalProfile = {
          ...profile,
          avatar: updatedAvatarPath
        };
        setProfile(finalProfile);
        
        // Update preview
        setPreview(process.env.NEXT_PUBLIC_BACKEND_URL + updatedAvatarPath);
        
        // Update localStorage
        const authData = JSON.parse(localStorage.getItem('authData') || '{}');
        const updated = {
          ...authData,
          avatarUrl: updatedAvatarPath,
        };
        localStorage.setItem('authData', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('authDataUpdated', { detail: updated }));
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (!userId) return <div className="text-center p-8 text-red-500">Please log in</div>;
  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-12 h-12 text-purple-500 animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-2 text-purple-500">Edit Profile</h1>
      <p className="text-gray-400 mb-8">Update your information</p>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-red-900/20 border-red-500 text-red-400'} border-2`}>
          {message.text}
        </div>
      )}

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-4 group">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-purple-500">
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
                <User className="w-16 h-16 text-purple-500" />
              </div>
            )}
          </div>
          <label className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <Camera className="w-8 h-8 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <p className="text-gray-400 text-sm">Click to upload • Max 5MB</p>
      </div>

      {/* Form */}
      <div className="bg-black/20 border-2 border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-purple-500 mb-6">Basic Information</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <FuturisticInput
            label="Username"
            icon={User}
            value={profile.username}
            onChange={(e) => handleChange('username', e.target.value)}
            error={errors.username}
          />
          
          <FuturisticInput
            label="Email"
            icon={Mail}
            type="email"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />
          
          <FuturisticInput
            label="Points"
            type="number"
            value={profile.points}
            disabled
          />
          
          <FuturisticInput
            label="Rank"
            type="number"
            value={profile.rank || ''}
            onChange={(e) => handleChange('rank', parseInt(e.target.value) || null)}
          />
        </div>

        <div className="mt-4">
          <FuturisticTextarea
            label="Bio (max 500 characters)"
            value={profile.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={4}
            maxLength={500}
            error={errors.bio}
          />
          <p className="text-gray-500 text-xs">{profile.bio?.length || 0}/500</p>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </>
        )}
      </button>
    </div>
  );
}