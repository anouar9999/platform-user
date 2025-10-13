import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  X,
  Upload,
  Shield,
  Trophy,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useToast } from '@/app/components/toast/ToastProviderContext';

// Validation schemas for each step
const stepSchemas = {
  1: yup.object({
    name: yup.string().required('Team name is required').min(3, 'Must be at least 3 characters'),
    tag: yup.string().required('Team tag is required').max(10, 'Max 10 characters'),
    description: yup.string().required('Description is required').min(10, 'Min 10 characters'),
  }),
  2: yup.object({
    logo: yup.string().required('Team logo is required'),
    banner: yup.string().nullable(),
  }),
  3: yup.object({
    game_id: yup.number().required('Please select a game').positive('Please select a game'),
  }),
  4: yup.object({
    discord: yup.string().url('Must be a valid URL').nullable(),
    twitter: yup.string().nullable(),
    contact_email: yup.string().email('Must be a valid email').nullable(),
  }),
};

const FORM_STEPS = [
  { id: 1, title: 'Team Identity', icon: Shield },
  { id: 2, title: 'Team Branding', icon: Upload },
  { id: 3, title: 'Game Selection', icon: Trophy },
  { id: 4, title: 'Contact Info', icon: MessageSquare },
];

const FuturisticInput = ({ label, error, register, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  return (
    <div className="relative inline-block px-1 w-full group mb-1">
      <div
        className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
          error ? 'border-red-500' : isFocused ? 'border-orange-500' : 'border-transparent'
        }`}
      ></div>
      <div
        className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
          error ? 'border-red-500' : isFocused ? 'border-orange-500' : 'border-transparent'
        }`}
      ></div>

      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{
          clipPath:
            'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          transform: isFocused ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <div
          className={`relative transition-all duration-300 ${
            error
              ? 'bg-red-900/20 border-2 border-red-500/50'
              : isFocused
              ? 'bg-black/60 border-2 border-orange-500/50'
              : 'bg-black/40 border-2 border-white/10'
          }`}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50 pointer-events-none"></div>

          <div
            className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
              error ? 'via-red-500' : 'via-orange-500'
            } to-transparent transition-opacity duration-300 ${
              isFocused ? 'opacity-100' : 'opacity-0'
            }`}
          ></div>

          <label
            className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
              isFocused || hasValue
                ? 'top-2 text-xs text-orange-500'
                : 'top-1/2 -translate-y-1/2 text-sm'
            }`}
          >
            {label}
          </label>

          <input
            {...register}
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
              register.onChange(e);
            }}
            className="relative z-10 w-full px-4 pt-6 pb-2 bg-transparent text-white focus:outline-none transition-all duration-300"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
};

const FuturisticTextarea = ({ label, error, register, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  return (
    <div className="relative inline-block px-1 w-full group">
      <div
        className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
          error ? 'border-red-500' : 'border-transparent group-focus-within:border-orange-500'
        }`}
      ></div>
      <div
        className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
          error ? 'border-red-500' : 'border-transparent group-focus-within:border-orange-500'
        }`}
      ></div>

      <div
        className="relative overflow-hidden transition-all duration-300 group-focus-within:scale-[1.02]"
        style={{
          clipPath:
            'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}
      >
        <div
          className={`relative border transition-all duration-300 ${
            error
              ? 'bg-red-900/20 border-red-500/50'
              : 'bg-black/40 border-white/10 group-focus-within:border-orange-500/50'
          }`}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)_1px,rgba(255,255,255,0.02)_2px)] opacity-50 pointer-events-none"></div>

          <label
            className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
              isFocused || hasValue ? 'top-2 text-xs text-orange-500' : 'top-4 text-sm'
            }`}
          >
            {label}
          </label>

          <textarea
            {...register}
            {...props}
            rows={4}
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
              register.onChange(e);
            }}
            className="relative z-10 w-full px-4 pt-8 pb-2 bg-transparent text-white focus:outline-none transition-all duration-300 resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
};

const CreateTeamForm = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    mode: 'onChange',
    defaultValues: {
      name: '',
      tag: '',
      description: '',
      logo: null,
      banner: null,
      game_id: null,
      division: 'silver',
      tier: 'amateur',
      discord: '',
      twitter: '',
      contact_email: '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isOpen) {
      fetchGames();
    }
  }, [isOpen]);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/all_games.php`);
      const data = await response.json();
      if (data.success) {
        setGames(data.games);
      }
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast({
          type: 'error',
          message: `Image must be less than 2MB`,
          duration: 5000,
          position: 'bottom-right',
        });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogoPreview(reader.result);
        setValue('logo', reader.result);
      } else {
        setBannerPreview(reader.result);
        setValue('banner', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const goToNextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (currentStep < FORM_STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        await onSubmit(watchedValues);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

const onSubmit = async (data) => {
  setLoading(true);
  try {
    const authData = JSON.parse(localStorage.getItem('authData'));
    const userId = authData?.userId;

    // Create FormData instead of JSON
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(data).forEach(key => {
      if (key !== 'logo' && key !== 'banner') {
        formData.append(key, data[key]);
      }
    });
    
    // Add user IDs
    formData.append('owner_id', userId);
    formData.append('captain_id', userId);
    
    // Add files directly (not base64)
    if (data.logo instanceof File) {
      formData.append('logo', data.logo);
    }
    
    if (data.banner instanceof File) {
      formData.append('banner', data.banner);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create_team.php`, {
      method: 'POST',
      // Don't set Content-Type header - browser will set it with boundary
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      addToast({
        type: 'success',
        message: 'Team created successfully!',
        duration: 5000,
        position: 'bottom-right',
      });
      onSuccess?.();
      onClose();
    } else {
      throw new Error(result.message || 'Failed to create team');
    }
  } catch (err) {
    console.error('Error creating team:', err);
    addToast({
      type: 'error',
      message: `Failed to create team: ${err.message}`,
      duration: 5000,
      position: 'bottom-right',
    });
  } finally {
    setLoading(false);
  }
};
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 max-w-3xl mx-auto p-6">
            <div className="mb-8">
              <h2 className="text-3xl font-zentry text-primary mb-2 uppercase ">Team Identity</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-500/30 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FuturisticInput label="Team Name" error={errors.name} register={register('name')} />

              <FuturisticInput
                label="Team Tag (max 10)"
                error={errors.tag}
                register={register('tag')}
                maxLength={10}
              />
            </div>

            <FuturisticTextarea
              label="Description"
              error={errors.description}
              register={register('description')}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 max-w-4xl mx-auto p-6">
            <div className="mb-8 mx-auto text-center flex flex-col justify-center items-start">
              <h2 className="text-3xl font-zentry text-primary text-center mb-2 uppercase ">
                Team Branding
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-500/30 rounded-full "></div>
            </div>

            <div className="relative inline-block px-1 w-full group">
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-orange-500"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-orange-500"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-orange-500"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-orange-500"></div>

              <div
                className="relative overflow-hidden"
                style={{
                  clipPath:
                    'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                }}
              >
                <div className="relative bg-black/40 border border-gray-800">
                  {/* Banner Section */}
                  <div className="relative h-48 bg-gray-900 cursor-pointer group/banner">
                    {bannerPreview ? (
                      <>
                        <img
                          src={bannerPreview}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-black/80 px-4 py-2 rounded-lg flex items-center gap-2">
                            <Upload size={18} className="text-orange-500" />
                            <span className="text-white text-sm">Change Banner</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop"
                          alt="Default banner"
                          className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-2 text-orange-500" />
                            <p className="text-white font-bold">Click to upload banner</p>
                            <p className="text-gray-400 text-sm mt-1">Recommended: 1920x400px</p>
                          </div>
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'banner')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Logo and Team Info */}
                  <div
                    className="relative px-6 pb-6 flex items-end gap-4"
                    style={{ marginTop: '-2rem' }}
                  >
                    <div className="relative w-24 h-24 bg-gray-800 border-4 border-black rounded-lg cursor-pointer group/logo overflow-hidden">
                      {logoPreview ? (
                        <>
                          <img
                            src={logoPreview}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload size={20} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src="https://ui-avatars.com/api/?name=Team&background=1f2937&color=f97316&size=200&bold=true"
                            alt="Default logo"
                            className="w-full h-full object-cover opacity-40"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover/logo:bg-black/60 transition-colors">
                            <Upload
                              className="text-orange-500 group-hover/logo:scale-110 transition-transform"
                              size={32}
                            />
                          </div>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'logo')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex-1 pb-2">
                      <h3 className="text-3xl font-zentry text-white">
                        {watchedValues.name || 'Your Team Name'}
                      </h3>
                      <span className="text-orange-500 text-sm font-circular-web font-bold">
                        {watchedValues.tag || 'TAG'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errors.logo && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.logo.message}
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 max-w-6xl mx-auto p-6">
            <div className="mb-8">
              <h2 className="text-3xl font-zentry   text-primary mb-2 uppercase ">
                Select Your favorite Game{' '}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-500/30 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setValue('game_id', parseInt(game.id))}
                  className="relative inline-block px-1 group cursor-pointer"
                >
                  <div
                    className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${
                      watchedValues.game_id === parseInt(game.id)
                        ? 'border-orange-500 w-3 h-3'
                        : 'border-transparent group-hover:border-orange-500'
                    }`}
                  ></div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${
                      watchedValues.game_id === parseInt(game.id)
                        ? 'border-orange-500 w-3 h-3'
                        : 'border-transparent group-hover:border-orange-500'
                    }`}
                  ></div>

                  <div
                    className={`relative overflow-hidden transition-all duration-300 ${
                      watchedValues.game_id === parseInt(game.id)
                        ? 'scale-105'
                        : 'group-hover:scale-105'
                    }`}
                    style={{
                      clipPath:
                        'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                    }}
                  >
                    <div
                      className={`relative border transition-all duration-300 ${
                        watchedValues.game_id === parseInt(game.id)
                          ? 'border-orange-500/50'
                          : 'border-gray-800 group-hover:border-orange-500/30'
                      }`}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-white font-bold text-lg">{game.name}</h3>
                        </div>
                      </div>

                      {watchedValues.game_id === parseInt(game.id) && (
                        <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-1">
                          <Check size={16} className="text-black" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {errors.game_id && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.game_id.message}
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 max-w-3xl mx-auto p-6">
            <div className="mb-8">
              <h2 className="text-3xl font-zentry text-primary mb-2 uppercase ">
                Contact Information
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-500/30 rounded-full"></div>
            </div>

            <div className="space-y-6">
              <FuturisticInput
                label="Discord Server"
                error={errors.discord}
                register={register('discord')}
              />

              <FuturisticInput
                label="Twitter/X Handle"
                error={errors.twitter}
                register={register('twitter')}
              />

              <FuturisticInput
                label="Contact Email"
                type="email"
                error={errors.contact_email}
                register={register('contact_email')}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999]" onClick={onClose} />

      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-6xl h-[90vh] bg-black/95 border border-gray-800 pointer-events-auto overflow-hidden flex flex-col"
          style={{
            clipPath:
              'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
          }}
        >
          {/* Header with background image and strong left overlay */}
          <div className="sticky top-0 z-10 bg-secondary/90 backdrop-blur-xl">
            <div
              className="px-6 py-2 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  "url('https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/26e8fff3ab3587144420aaa27b0e85167bb47336-1920x1080.jpg')",
              }}
            >
              {/* Strong left gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.5) 100%)',
                  mixBlendMode: 'multiply',
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
                      <ArrowLeft
                        size={16}
                        className="text-white group-hover:translate-x-[-2px] transition-transform"
                      />
                    </button>
                    <p className="text-xs font-mono text-primary/50">
                      Step {currentStep} of {FORM_STEPS.length}
                    </p>
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{renderStepContent()}</div>

          {/* Navigation */}
          <div className="p-6 border-t border-gray-800 flex justify-between">
            <div className="relative inline-block px-1">
              <div
                className="relative overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  clipPath:
                    'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <button
                  onClick={currentStep === 1 ? onClose : goToPreviousStep}
                  className="relative bg-black/40 border border-gray-700 hover:border-gray-600 text-white px-8 py-3 flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span>{currentStep === 1 ? 'Cancel' : 'Previous'}</span>
                </button>
              </div>
            </div>

            <div className="relative inline-block px-1">
              <div
                className="relative overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  clipPath:
                    'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <button
                  onClick={goToNextStep}
                  disabled={loading}
                  className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-black px-8 py-3 flex items-center gap-2 font-bold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Creating...</span>
                    </>
                  ) : currentStep === FORM_STEPS.length ? (
                    <span>Create Team</span>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTeamForm;
