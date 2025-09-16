import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Upload,
  X,
  Shield,
  Trophy,
  Award,
  Twitter,
  Mail,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';
import FloatingLabelInput from '@/app/components/input/FloatingInput';
import FloatingLabelTextArea from '@/app/components/FloatingTextArea';
import { getValidationSchemaForStep } from './FormValidation';
import { set } from 'lodash';

const INPUT_BASE_CLASSES =
  'w-full bg-gray-900/50 px-4 py-2.5 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500';

// Updated initial state to match the exact fields from teams table
const FORM_INITIAL_STATE = {
  name: '',
  tag: '',        // Team short code/tag, max 10 chars
  description: '', // In teams table
  game_id: null,     // Default to Valorant (ID 2)
  logo: null,     // File upload for logo
  banner: null,   // File upload for banner
  division: 'silver', // Default division
  tier: 'amateur', // From enum('amateur','semi-pro','professional')
  discord: '',    // Discord server link
  twitter: '',    // Twitter/X handle
  contact_email: '', // Team contact email
  // We don't need to collect captain info in the form as it will be set automatically
  captain: {
    name: '',
  }
};

// Options updated to reflect database values
const OPTIONS = {
  games: [
    { value: 1, label: 'Free Fire',image:'https://image.jeuxvideo.com/medias-crop-1200-675/157563/1575630098-7585-card.jpg' },
    { value: 2, label: 'Valorant',image:'https://egamersworld.com/cdn-cgi/image/width=690,quality=75,format=webp/uploads/blog/1/17/1740786720182_1740786720182.webp' },
    { value: 3, label: 'Fc Football',image:'https://tgs.sega.jp/assets/images/title/fc25/title_FC25.jpg' },
    { value: 4, label: 'Street Fighter',image:'https://static.fnac-static.com/multimedia/Images/FD/Comete/171348/CCP_IMG_1200x800/2278322.jpg' }
  ],
  divisions: [
    { value: 'iron', label: 'Iron' },
    { value: 'bronze', label: 'Bronze' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'master', label: 'Master' }
  ],
  tiers: [
    { value: 'amateur', label: 'Amateur' },
    { value: 'semi-pro', label: 'Semi-Professional' },
    { value: 'professional', label: 'Professional' }
  ]
};

// Define the steps for the multi-step form
const FORM_STEPS = [
  { id: 1, title: "Team Identity", icon: Shield },
  { id: 2, title: "Team Branding", icon: Upload },
  { id: 3, title: "Game & Rankings", icon: Trophy },
  { id: 4, title: "Contact Info", icon: MessageSquare }
];

const FormSection = ({ title, icon: Icon, children }) => (
  <div className="p-4  text-primary">
    <h3 className="flex items-center text-3xl font-semibold font-valorant mb-6">
      <div className="relative flex items-center">
        <div className="pl-3">
          {/* <Icon className="mr-2" size={20} /> */}
        </div>
      </div>
      <div className="relative px-4">
      <div className="absolute left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent rounded-full mr-3"></div>

        {title}
      </div>
    </h3>
    {children}
  </div>
);

const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex justify-between items-center w-full px-6 py-4 bg-gray-900/50 border-b border-white/5">
    {steps.map((step, index) => {
      const StepIcon = step.icon;
      const isActive = step.id === currentStep;
      const isCompleted = step.id < currentStep;
      
      return (
        <div key={step.id} className="flex items-center">
          <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'w-full' : ''}`}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${isActive ? 'border-primary bg-primary/20 text-white' : 
                isCompleted ? 'border-green-500 bg-green-500/20 text-green-500' : 
                'border-gray-700 bg-gray-800/50 text-gray-500'}`}>
              <StepIcon size={18} />
            </div>
            <span className={`text-xs mt-1 font-medium hidden md:block
              ${isActive ? 'text-primary' : 
                isCompleted ? 'text-green-500' : 
                'text-gray-500'}`}>
              {step.title}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2">
              <div 
                className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`}
                style={{ width: isActive ? '50%' : isCompleted ? '100%' : '0%' }}
              ></div>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

const ImageUpload = ({ preview, onImageChange, label, description, name }) => (
  <div className="relative group mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <div className="w-full h-48 bg-dark border-2 border-dashed border-gray-700 rounded-xl overflow-hidden group-hover:border-primary/50 transition-colors">
      {preview ? (
        <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <Upload size={32} className="mb-2" />
          <span className="text-sm">Drop your {label.toLowerCase()} here</span>
          <span className="text-xs text-gray-500 mt-1">{description}</span>
        </div>
      )}
    </div>
    <input
      type="file"
      name={name}
      accept="image/png,image/jpeg,image/gif"
      onChange={onImageChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>
);

const CreateTeamForm = ({ isOpen, onClose, currentUser, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ...FORM_INITIAL_STATE,
    captain: { ...FORM_INITIAL_STATE.captain, name: currentUser?.username || '' },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const { addToast } = useToast();
  const [Games, setGames] = useState();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
      const localAuthData = localStorage.getItem('authData');

      const parsedData = JSON.parse(localAuthData);
      console.log(parsedData.userId)
      setUserId(parsedData.userId);
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/all_games.php`);
        const data = await response.json();
  
        if (data.success) {
          setGames(data.games);
          console.log(data.games)
        } else {
          throw new Error(data.message || 'Failed to fetch tournaments');
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
   
    fetchTournaments();
  }, []);
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => document.body.classList.remove('sidebar-open');
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      ...FORM_INITIAL_STATE,
      captain: { ...FORM_INITIAL_STATE.captain, name: currentUser?.username || '' },
    });
    setLogoPreview(null);
    setBannerPreview(null);
    setErrors({});
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: 'Image must be less than 2MB' }));
      return;
    }

    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, [type]: 'Please select an image file' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogoPreview(reader.result);
        setFormData((prev) => ({ ...prev, logo: reader.result }));
        // Clear error when valid file is uploaded
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.logo;
          return newErrors;
        });
      } else if (type === 'banner') {
        setBannerPreview(reader.result);
        setFormData((prev) => ({ ...prev, banner: reader.result }));
        // Clear error when valid file is uploaded
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.banner;
          return newErrors;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const validateCurrentStep = async () => {
    try {
      const schema = getValidationSchemaForStep(currentStep);
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const formattedErrors = {};
      if (validationErrors.inner) {
        validationErrors.inner.forEach(error => {
          formattedErrors[error.path] = error.message;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ form: validationErrors.message });
      }
      return false;
    }
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      if (currentStep < FORM_STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const isValid = await validateCurrentStep();
    if (!isValid) return;
    
    setLoading(true);
    
    try {
      // Get the current user ID (owner who's creating the team)
   
      
      if (!userId) throw new Error('User not authenticated');
  
      // Structure the data to match teams table
      const teamData = {
        name: formData.name.trim(),
        tag: formData.tag.trim(),
        owner_id: parseInt(userId), // Automatically set the owner_id to the current user ID
        captain_id: parseInt(userId), // Also set the captain_id to the same user
        game_id: formData.game_id,
        description: formData.description.trim(),
        logo: formData.logo,
        banner: formData.banner,
        division: formData.division,
        tier: formData.tier,
        discord: formData.discord,
        twitter: formData.twitter,
        contact_email: formData.contact_email
      };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create_team.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData),
      });
  
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Failed to create team');
      
      // Also create initial team member entry for the owner/captain
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add_team_member.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            team_id: result.team_id,
            user_id: parseInt(userId),
            role: 'Captain',
            is_captain: 1
          }),
        });
      } catch (memberErr) {
        console.error('Warning: Could not add owner as team member:', memberErr);
        // Continue anyway since the team was created successfully
      }
  
      addToast({ type: 'success', message: 'Team created successfully!', duration: 5000 });
      onClose();
      onFinish?.();
    } catch (err) {
      console.error('Error:', err);
      setErrors({ form: err.message });
      addToast({ type: 'error', message: err.message, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Render error messages for a specific field
  const renderFieldError = (fieldName) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-xs  flex items-center">
        <AlertCircle size={12} className="mr-1" />
        {errors[fieldName]}
      </p>
    ) : null;
  };  

  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <FormSection title="Team Identity" icon={Shield}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className='mb-8'>
              <FloatingLabelInput
                label="Team Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  // Clear error when user types
                  if (errors.name) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.name;
                      return newErrors;
                    });
                  }
                }}
                placeholder="Enter your team name"
                error={!!errors.name}
              />
              {renderFieldError('name')}
            </div>
            
            <div className='mb-8'>
              <FloatingLabelInput
                label="Team Tag (max 10 chars)"
                type="text"
                name="tag"
                maxLength={10}
                value={formData.tag}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, tag: e.target.value }));
                  // Clear error when user types
                  if (errors.tag) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.tag;
                      return newErrors;
                    });
                  }
                }}
                placeholder="Short team code (e.g. TSM, C9)"
                error={!!errors.tag}
              />
              {renderFieldError('tag')}
            </div>
          </div>
          
          <div className='mb-8'>
            <FloatingLabelTextArea
              label="Description"
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, description: e.target.value }));
                // Clear error when user types
                if (errors.description) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.description;
                    return newErrors;
                  });
                }
              }}
              placeholder="Tell us about your team..."
              name="description"
              error={!!errors.description}
            />
            {renderFieldError('description')}
          </div>
        </FormSection>
        );
      
      case 2:
        return (
          <FormSection title="Team Branding" icon={Upload}>
      <div className="flex flex-col gap-6">
        {/* Combined Banner Preview and Upload Section */}
        <div className="relative angular-cut overflow-hidden bg-gray-900 shadow-lg">
          {/* Interactive Preview Area with Banner, Logo and Team Name */}
          <div className="relative aspect-[calc(4*3+1)/3] bg-gray-950 overflow-hidden">
            {/* Banner Background - Clickable for upload */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 group cursor-pointer">
              {bannerPreview ? (
                <>
                  <img 
                    src={bannerPreview} 
                    alt="Team banner" 
                    className="w-full h-full object-cover"
                  />
                  {/* Hover overlay for banner */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="bg-black/80 px-4 py-3 rounded-lg flex items-center gap-3">
                      <Upload size={18} className="text-primary" />
                      <span className="text-white text-sm">Change Banner</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-700 text-xl font-bold opacity-30 uppercase tracking-widest">
                    Banner Preview
                  </div>
                  {/* Upload prompt for banner */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-20 h-20 mx-auto mb-3 rounded-full ${errors.banner ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Upload size={32} />
                      </div>
                      <p className={`font-medium mb-1 ${errors.banner ? 'text-red-400' : 'text-gray-300'}`}>Click to Upload Banner</p>
                      <p className="text-xs text-gray-500">Recommended size: 1920×820px</p>
                    </div>
                  </div>
                </>
              )}
              
              {/* Banner File Input */}
              <input
                type="file"
                name="banner"
                accept="image/png,image/jpeg,image/gif"
                onChange={(e) => handleImageChange(e, 'banner')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
            </div>
            
            {/* Team Identity Footer */}
            <div className="absolute bottom-4 left-0 right-0 px-6 py-4 flex items-end justify-between">
              {/* Logo Section - Clickable for upload */}
              <div className="relative z-10">
                <div className={`w-20 h-20 md:w-24 md:h-24 bg-gray-800 rounded-lg overflow-hidden border-4 ${errors.logo ? 'border-red-500/30' : 'border-gray-950'} shadow-xl transform translate-y-4 group cursor-pointer`}>
                  {logoPreview ? (
                    <>
                      <img 
                        src={logoPreview} 
                        alt="Team logo" 
                        className="w-full h-full object-cover"
                      />
                      {/* Hover overlay for logo */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <Upload size={20} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${errors.logo ? 'bg-red-900/30 group-hover:bg-red-900/50' : 'bg-gray-900 group-hover:bg-gray-800'} transition-colors`}>
                      <Upload size={24} className={`${errors.logo ? 'text-red-500' : 'text-gray-500 group-hover:text-primary'} transition-colors`} />
                    </div>
                  )}
                  
                  {/* Logo File Input */}
                  <input
                    type="file"
                    name="logo"
                    accept="image/png,image/jpeg,image/gif"
                    onChange={(e) => handleImageChange(e, 'logo')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                
                {/* Logo upload indicator */}
                {!logoPreview && (
                  <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap ${errors.logo ? 'bg-red-500/80' : 'bg-primary/80'} text-white text-xs px-2 py-1 rounded ${errors.logo ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    {errors.logo ? errors.logo : 'Upload Logo'}
                  </div>
                )}
              </div>
              
              {/* Team Name Section */}
              <div className="flex-1 ml-4 mb-2">
                <h3 className="text-white text-2xl md:text-3xl font-custom truncate">
                  {formData.name || "Your Team Name"}
                </h3>
                <div className="flex items-center mt-1">
                  <span className="bg-primary/20 text-primary px-2 py-0.5 text-xs font-medium">
                    {formData.tag || "TAG"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Error display at the bottom */}
          {(errors.logo || errors.banner) && (
            <div className="p-3 bg-red-500/10 border-t border-red-500/20">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-sm text-red-400">
                  {errors.logo || errors.banner}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormSection>
        );
      
      case 3:
        return (
          <FormSection title="Game Selection" icon={Trophy}>
          <div className="grid grid-cols-1 gap-6">
            {/* Game Banner Cards - Replaces the FloatingSelectField */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
              {Games.map((game) => (
                <div
                  key={game.value}
                  className={`relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                    formData.game_id === parseInt(game.id) 
                      ? 'border-primary shadow-md' 
                      : 'border-none  '
                  }`}
                  onClick={() => setFormData((prev) => ({ 
                    ...prev, 
                    game_id: parseInt(game.id) 
                  }))}
                >
                  {/* Game Image */}
                  <div className="aspect-video w-full angular-cut">
                    <img
                      src={game.image || `https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTMMsfGwzCih5pUQiV6Pi_7w5RUqIxOXz3gp4_e7iE7M37Z4XK0hPcwrRbdL3DGZ2LVlCsBSiRWhw4LhAeWfgZfR3Bc6jYrL0TI1nqDew`}
                      alt={game.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Game Name Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
                    <h3 className="text-white font-custom tracking-wider text-2xl">{game.name}</h3>
                  </div>
                  
                  {/* Selected indicator */}
                  {formData.game_id === parseInt(game.id) && (
                    <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
          
          </div>
        </FormSection>
        );
      
      case 4:
        return (
          <FormSection title="Team Contact Information" icon={MessageSquare}>
      <div className="grid grid-cols-1 gap-4">
      <div className='mb-8'>
          <FloatingLabelInput
            label="Discord Server"
            type="text"
            name="discord"
            value={formData.discord}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, discord: e.target.value }));
              // Clear error when user types
              if (errors.discord) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.discord;
                  return newErrors;
                });
              }
            }}
            placeholder="Discord server invite link"
            icon={MessageSquare}
            error={!!errors.discord}
          />
          {renderFieldError('discord')}
        </div>
        
        <div className='mb-8'>
        <FloatingLabelInput
            label="Twitter/X Handle"
            type="text"
            name="twitter"
            value={formData.twitter}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, twitter: e.target.value }));
              // Clear error when user types
              if (errors.twitter) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.twitter;
                  return newErrors;
                });
              }
            }}
            placeholder="@yourteamhandle"
            icon={Twitter}
            error={!!errors.twitter}
          />
          {renderFieldError('twitter')}
        </div>
        
        <div className='mb-8'>
        <FloatingLabelInput
            label="Contact Email"
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, contact_email: e.target.value }));
              // Clear error when user types
              if (errors.contact_email) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.contact_email;
                  return newErrors;
                });
              }
            }}
            placeholder="team@example.com"
            icon={Mail}
            error={!!errors.contact_email}
          />
          {renderFieldError('contact_email')}
        </div>
      </div>
    </FormSection>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
    <style jsx global>{`
      body.sidebar-open {
        overflow: hidden;
      }
    `}</style>
    
    {/* Dark overlay */}
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm mb-0 space-y-reverse z-[99999999] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-hidden="true"
    />
    
    {/* Sidebar container */}
    <div 
      className={`fixed top-0 right-0 bottom-0 z-[9999999999] mb-0 space-y-reverse w-full md:w-full lg:w-full xl:w-full4 2xl:w-full bg-secondary/90 backdrop-blur-xl border-l border-white/5 z-50 transform transition-transform duration-300 ease-in-out overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Content container with scroll */}
      <div className="h-full flex flex-col overflow-hidden z-[9999999999]">
        {/* Header with background image and strong left overlay */}
        <div className="sticky top-0 z-10 bg-secondary/90 backdrop-blur-xl">
          <div 
            className="px-6 py-2 bg-cover bg-center relative"
            style={{
              backgroundImage: "url('https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/26e8fff3ab3587144420aaa27b0e85167bb47336-1920x1080.jpg')",
            }}
          >
            {/* Strong left gradient overlay */}
            <div 
              className="absolute inset-0" 
              style={{
                background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.5) 100%)',
                mixBlendMode: 'multiply'
              }}
            ></div>
            
            {/* Close button in header */}
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 text-white p-2 rounded-full z-20 transition-all duration-200 hover:scale-105"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center relative z-10">
              <div className="flex-1">
                <div className="flex items-end mb-2">
                  <button 
                    onClick={onClose}
                    className="bg-primary/20 hover:bg-primary/30 p-2 rounded-md transition-all mr-3 group"
                  >
                    <ArrowLeft size={16} className="text-white group-hover:translate-x-[-2px] transition-transform" />
                  </button>
                  <p className="text-xs font-mono text-primary/50">Step {currentStep} of {FORM_STEPS.length}</p>
                </div>
                <h2 className="text-4xl font-bold font-custom text-transparent bg-clip-text bg-white drop-shadow-lg tracking-widest">
                  Create Your Team
                </h2>
              </div>
            </div>
          </div>
          
          {/* Step indicator */}
          {/* <StepIndicator currentStep={currentStep} steps={FORM_STEPS} /> */}
        </div>
        
        {/* Scrollable form content - MODIFIED FOR VERTICAL CENTERING */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <form onSubmit={(e) => e.preventDefault()} className="font-pilot flex flex-col h-full">
           

            {/* Render step content - MODIFIED FOR VERTICAL CENTERING */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full">
                {renderStepContent()}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between m-4 p-4 border-t border-white/5">
              <button
                type="button"
                onClick={currentStep === 1 ? onClose : goToPreviousStep}
                className="px-8 py-2.5 angular-cut  text-gray-300 bg-dark focus:ring-2 focus:ring-purple-500 transition-all flex items-center gap-2"
                disabled={loading}
              >
                {currentStep === 1 ? 'Cancel' : (
                  <>
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={goToNextStep}
                disabled={loading}
                className="px-8 py-2.5 angular-cut bg-primary text-white hover:bg-primary/70 focus:ring-2 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : currentStep === FORM_STEPS.length ? (
                  <>
                    <PlusCircle size={18} />
                    <span>Create Team</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default CreateTeamForm;
