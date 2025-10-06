'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  User,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });
  const [signupStep, setSignupStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const { register, handleSubmit, watch, formState: { errors }, trigger, setError } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      newsletter: false,
      riotConsent: false,
      bio: ''
    }
  });

  const password = watch('password');
  const email = watch('email');
  const username = watch('username');
  const confirmPassword = watch('confirmPassword');
  const termsAccepted = watch('termsAccepted');

  const validateStep = async () => {
    let isValid = false;
    
    if (signupStep === 1) {
      isValid = await trigger('email');
    } else if (signupStep === 2) {
      isValid = await trigger('username');
    } else if (signupStep === 3) {
      isValid = await trigger(['password', 'confirmPassword']);
    } else if (signupStep === 4) {
      isValid = await trigger('termsAccepted');
    }
    
    return isValid;
  };

  const handleNextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setSignupStep(prev => prev + 1);
      setServerMessage({ type: '', message: '' });
    }
  };

  const handlePrevStep = () => {
    setSignupStep(prev => prev - 1);
    setServerMessage({ type: '', message: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setServerMessage({
        type: 'error',
        message: 'File size should be less than 5MB',
      });
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setServerMessage({
        type: 'error',
        message: 'Only JPG, PNG, GIF, and WebP images are allowed',
      });
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

const onSubmit = async (data) => {
  setServerMessage({ type: '', message: '' });
  setIsLoading(true);

  console.log('🔄 Signup attempt:', {
    email: data.email,
    username: data.username,
    timestamp: new Date().toISOString()
  });

  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_register.php`;
    
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }

    console.log('📤 Sending request to:', url);

    const formDataToSend = new FormData();
    formDataToSend.append('email', data.email.trim());
    formDataToSend.append('username', data.username.trim());
    formDataToSend.append('password', data.password);
    
    // Only send bio if it has content
    if (data.bio && data.bio.trim()) {
      formDataToSend.append('bio', data.bio.trim());
    }

    // Avatar file
    if (avatarFile) {
      console.log('📎 Attaching avatar:', avatarFile.name, avatarFile.size, 'bytes');
      formDataToSend.append('avatar', avatarFile);
    }

    // Log what we're sending (without sensitive data)
    console.log('📋 Form data:', {
      email: data.email,
      username: data.username,
      data : data,
      hasBio: !!(data.bio && data.bio.trim()),
      hasAvatar: !!avatarFile
    });

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formDataToSend,
    });

    console.log('📥 Response status:', response.status, response.statusText);

    // Try to get response body regardless of status
    let responseData;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('📦 Response data:', responseData);
      } else {
        // If not JSON, get as text for debugging
        const textResponse = await response.text();
        console.log('📄 Response (text):', textResponse.substring(0, 500));
        
        // Try to parse it anyway
        try {
          responseData = JSON.parse(textResponse);
        } catch {
          throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
        }
      }
    } catch (parseError) {
      console.error('❌ Failed to parse response:', parseError);
      throw new Error(`Server error (${response.status}): Unable to parse response. Check server logs.`);
    }

    // Handle non-200 responses
    if (!response.ok) {
      console.error('❌ Server error:', responseData);
      
      // Extract error message with fallbacks
      const errorMessage = 
        responseData?.message || 
        responseData?.error || 
        `Server error (${response.status})`;
      
      // Include debug info if available
      if (responseData?.debug) {
        console.error('🔍 Debug info:', responseData.debug);
      }
      
      throw new Error(errorMessage);
    }

    // Check success flag
    if (!responseData.success) {
      console.error('❌ Registration failed:', responseData.message);
      throw new Error(responseData.message || 'Registration failed');
    }

    console.log('✅ Registration successful!', responseData);

    // Handle email verification flow
    // if (responseData.requires_verification) {
    //   setServerMessage({
    //     type: 'success',
    //     message: 'Account created! Please check your email to verify your account.',
    //   });
      
    //   setTimeout(() => {
    //     window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify-email`;
    //   }, 2000);
    //   return;
    // }

    // Handle immediate login (if no verification required)
    const authData = {
      sessionToken: responseData.session_token || null,
      userId: responseData.user_id,
      username: responseData.username || data.username,
      userType: responseData.user_type || 'participant',
      avatarUrl: responseData.avatar || null,
      timestamp: new Date().getTime()
    };

    localStorage.setItem('authData', JSON.stringify(authData));

    setServerMessage({
      type: 'success',
      message: `Welcome, ${data.username}! Redirecting...`,
    });

    setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`;
    }, 1500);

  } catch (error) {
    console.error('❌ Signup error:', error);
    
    // Determine error type and provide helpful message
    let errorMessage = error.message;
    
    if (error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError') || 
        error.message.includes('ERR_CONNECTION')) {
      errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
    } else if (error.message.includes('CORS')) {
      errorMessage = 'Server configuration error. Please contact support. (CORS issue)';
    } else if (error.message.includes('500')) {
      errorMessage = 'Server error occurred. Please try again in a few moments or contact support if the problem persists.';
    }
    
    setServerMessage({
      type: 'error',
      message: errorMessage,
    });
  } finally {
    setIsLoading(false);
  }
};

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  const formItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-secondary font-circular-web">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-24 md:w-36 z-50">
        <img
          src="/images/logo-gamius-white.png"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        className="hidden md:flex md:w-7/12 relative items-end"
        style={{
          backgroundImage: 'url(https://lolstatic-a.akamaihd.net/rso-authenticator-ui/0.87.4/assets/arcane_dsktp_rightAlignedCard_BG_2x.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center z-50 p-12 w-full">
          <h1 className="text-3xl lg:text-5xl font-zentry uppercase tracking-wider mb-4 text-orange-500">
            Creer un compte
          </h1>
          <p className="text-gray-300 text-lg font-circular-web">Rejoignez la communauté gaming</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b z-10 from-black/20 to-gray-900"></div>
      </motion.div>

      <div className="w-full md:w-full flex items-center justify-center p-4 sm:p-6 md:p-12 pt-24 md:pt-6">
        <motion.div
          className="relative w-full max-w-2xl bg-secondary z-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        > 
          <div className="p-4 sm:p-6 md:p-8">
            <div className="md:hidden text-center mb-6">
              <h1 className="text-3xl font-street-fighter uppercase tracking-wider mb-2 text-orange-500">
                Créer un compte
              </h1>
              <p className="text-gray-300">Rejoignez la communauté gaming</p>
            </div>

            {serverMessage.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-start ${
                  serverMessage.type === 'success'
                    ? 'bg-green-900/30 border border-green-700'
                    : 'bg-red-900/30 border border-red-700'
                }`}
              >
                <CheckCircle
                  className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                    serverMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                />
                <p
                  className={`text-sm ${
                    serverMessage.type === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {serverMessage.message}
                </p>
              </motion.div>
            )}

            <div className="mt-6 flex justify-center mb-8">
              <div className="flex space-x-4 items-center">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-8 sm:w-10 rounded-full transition-all duration-300 ${
                      signupStep >= step ? 'bg-orange-500' : 'bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {signupStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6"
                    >
                      <h2 className="text-4xl md:text-5xl font-zentry  text-white">
                        Quelle est votre adresse e mail
                      </h2>
                      <p className="text-gray-400 mt-2">
                        Rassurez-vous, nous ne la donnerons à personne.
                      </p>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <input
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: 'Invalid email address'
                            }
                          })}
                          type="email"
                          placeholder="Your email address"
                          className="w-full px-4 py-3 bg-dark text-white focus:outline-none"
                        />
                      </div>
                      {errors.email && (
                        <div className="text-red-400 text-xs mt-2 ml-1 flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          {errors.email.message}
                        </div>
                      )}
                      {!errors.email && email && (
                        <div className="text-green-400 text-xs mt-2 ml-1 flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Email available
                        </div>
                      )}

                      <div className="mt-8">
                        <label className="flex items-start space-x-3 cursor-pointer group">
                          <input
                            {...register('riotConsent')}
                            type="checkbox"
                            className="w-5 h-5 mt-0.5 bg-gray-800 border-gray-600 rounded text-orange-500 focus:ring-orange-500 flex-shrink-0"
                          />
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            Oui ; Riot peut m'envoyer des informations concernant les nouvelles
                            sorties, les mises à jour du jeu, les événements ou tout autre contenu
                            Riot.
                          </span>
                        </label>
                      </div>
                    </motion.div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm font-bold">
                        <span className="px-2 bg-gray-900 text-gray-400">
                          Vous pouvez aussi créer un compte avec
                        </span>
                      </div>
                    </div>

                    <motion.div variants={formItemVariants} className="grid grid-cols-4 gap-3 sm:gap-6">
                      <button
                        type="button"
                        className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded"
                      >
                        <img
                          src="https://auth.gbarena.com/assets/social-media-icons/facebook-icon.svg"
                          alt="Facebook"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded"
                      >
                        <img
                          src="https://auth.gbarena.com/assets/social-media-icons/riot-icon.svg"
                          alt="Riot"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded"
                      >
                        <img
                          src="https://auth.gbarena.com/assets/social-media-icons/google-icon.svg"
                          alt="Google"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded"
                      >
                        <img
                          src="https://auth.gbarena.com/assets/social-media-icons/discord-icon.svg"
                          alt="Discord"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </button>
                    </motion.div>

                    <motion.button
                      type="button"
                      style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                      onClick={handleNextStep}
                      disabled={!email || errors.email}
                      className={`w-full sm:w-48 py-2.5 px-4 mx-auto text-lg font-zentry uppercase transition-all duration-300 flex items-center justify-center mt-4 ${
                        !email || errors.email
                          ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg'
                      }`}
                      whileHover={!email || errors.email ? {} : { scale: 1.02 }}
                      whileTap={!email || errors.email ? {} : { scale: 0.98 }}
                    >
                      <span>Continue</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.button>
                  </motion.div>
                )}

                {signupStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6"
                    >
                      <h2 className="text-4xl md:text-5xl font-zentry tracking-wide text-white">
                        Choisissez un nom d'utilisateur
                      </h2>
                      <p className="text-gray-400 mt-2">
                        Utilisé pour vous connecter à tous nos jeux.
                      </p>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Username
                      </label>
                      <div className="relative group">
                        <input
                          {...register('username', {
                            required: 'Username is required',
                            minLength: {
                              value: 3,
                              message: 'Username must be at least 3 characters'
                            }
                          })}
                          type="text"
                          placeholder="Your username"
                          className="w-full px-4 py-3 bg-dark text-white focus:outline-none"
                        />
                      </div>
                      {errors.username && (
                        <div className="text-red-400 text-xs mt-2 ml-1 flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          {errors.username.message}
                        </div>
                      )}
                      {!errors.username && username && (
                        <div className="text-green-400 text-xs mt-2 ml-1 flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Username available
                        </div>
                      )}
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                      <motion.button
                        type="button"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                        onClick={handlePrevStep}
                        className="w-full sm:w-48 bg-gray-800/80 text-gray-300 py-2.5 px-4 font-zentry text-lg hover:bg-gray-700/90 transition-all duration-300 border border-gray-700/40 flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        <span>Back</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                        onClick={handleNextStep}
                        disabled={!username || errors.username}
                        className={`w-full sm:w-48 py-2.5 px-4 font-zentry text-lg transition-all duration-300 flex items-center justify-center ${
                          !username || errors.username
                            ? 'bg-gray-700/80 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg'
                        }`}
                        whileHover={!username || errors.username ? {} : { scale: 1.02 }}
                        whileTap={!username || errors.username ? {} : { scale: 0.98 }}
                      >
                        <span>Continue</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {signupStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6"
                    >
                      <h2 className="text-3xl md:text-4xl font-zentry tracking-wide text-white">
                        Choisissez un mot de passe
                      </h2>
                      <p className="text-gray-400 mt-2">Trouvez-en un bon.</p>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <input
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters'
                            }
                          })}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          className="w-full px-4 py-3 bg-dark text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <div className="text-red-400 text-xs mt-2 ml-1">
                          {errors.password.message}
                        </div>
                      )}

                      <div className="mt-2 px-4">
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li
                            className={`flex items-center ${
                              password && password.length >= 8 ? 'text-green-400' : ''
                            }`}
                          >
                            <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                            At least 8 characters long
                          </li>
                          <li
                            className={`flex items-center ${
                              password && /[A-Z]/.test(password)
                                ? 'text-green-400'
                                : ''
                            }`}
                          >
                            <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                            Contains at least one uppercase letter
                          </li>
                          <li
                            className={`flex items-center ${
                              password && /[a-z]/.test(password)
                                ? 'text-green-400'
                                : ''
                            }`}
                          >
                            <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                            Contains at least one lowercase letter
                          </li>
                          <li
                            className={`flex items-center ${
                              password && /\d/.test(password) ? 'text-green-400' : ''
                            }`}
                          >
                            <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                            Contains at least one number
                          </li>
                        </ul>
                      </div>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <input
                          {...register('confirmPassword', {
                            validate: value => value === password || 'Passwords must match'
                          })}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          className="w-full px-4 py-3 bg-dark text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <div className="text-red-400 text-xs mt-2 ml-1">
                          {errors.confirmPassword.message}
                        </div>
                      )}
                      {!errors.confirmPassword &&
                        confirmPassword &&
                        password === confirmPassword && (
                          <div className="text-green-400 text-xs mt-2 ml-1 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Passwords match
                          </div>
                        )}
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                      <motion.button
                        type="button"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                        onClick={handlePrevStep}
                        className="w-full sm:w-48 bg-gray-800/80 text-gray-300 py-2.5 px-4 font-zentry text-lg hover:bg-gray-700/90 transition-all duration-300 border border-gray-700/40 flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        <span>Back</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                        onClick={handleNextStep}
                        disabled={
                          !password ||
                          !confirmPassword ||
                          errors.password ||
                          errors.confirmPassword ||
                          password !== confirmPassword
                        }
                        className={`w-full sm:w-48 py-2.5 px-4 font-zentry text-lg transition-all duration-300 flex items-center justify-center ${
                          !password ||
                          !confirmPassword ||
                          errors.password ||
                          errors.confirmPassword ||
                          password !== confirmPassword
                            ? 'bg-gray-700/80 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg'
                        }`}
                        whileHover={
                          !password ||
                          !confirmPassword ||
                          errors.password ||
                          errors.confirmPassword ||
                          password !== confirmPassword
                            ? {}
                            : { scale: 1.02 }
                        }
                        whileTap={
                          !password ||
                          !confirmPassword ||
                          errors.password ||
                          errors.confirmPassword ||
                          password !== confirmPassword
                            ? {}
                            : { scale: 0.98 }
                        }
                      >
                        <span>Continue</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {signupStep === 4 && (
                  <motion.div
                    key="step4"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6"
                    >
                      <h2 className="text-3xl md:text-4xl font-zentry tracking-wide text-white">Almost Done!</h2>
                      <p className="text-gray-400 mt-2">
                        Final touches before you join the community
                      </p>
                    </motion.div>

                    <motion.div variants={formItemVariants} className="text-center">
                      <label className="block text-gray-300 text-sm font-medium mb-4">
                        Profile Picture (Optional)
                      </label>
                      <div className="flex justify-center">
                        <div className="relative group cursor-pointer">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="h-24 w-24 rounded-full object-cover border-2 border-orange-500"
                            />
                          ) : (
                            <div className="h-24 w-24 rounded-full bg-dark border-2 border-dashed border-gray-600 flex items-center justify-center">
                              <User className="h-10 w-10 text-gray-500" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <span className="text-sm text-gray-200">Change</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label="Upload profile picture"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Bio (Optional)
                      </label>
                      <textarea
                        {...register('bio')}
                        placeholder="Tell us a bit about yourself"
                        rows={3}
                        className="w-full px-4 py-3 bg-dark text-white focus:outline-none resize-none"
                      ></textarea>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <label className="flex items-start space-x-3 cursor-pointer group">
                        <input
                          {...register('termsAccepted', {
                            required: 'You must accept the terms'
                          })}
                          type="checkbox"
                          className="w-5 h-5 mt-0.5 bg-gray-800 border-gray-600 rounded text-orange-500 focus:ring-orange-500 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          I agree to the{' '}
                          <a href="#" className="text-orange-500 underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-orange-500 underline">
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>  
                      {errors.termsAccepted && (
                        <div className="text-red-400 text-xs mt-2 ml-1 flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          {errors.termsAccepted.message}
                        </div>
                      )}
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                      <motion.button
                        type="button"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                        onClick={handlePrevStep}
                        className="w-full sm:w-48 bg-gray-800/80 text-gray-300 py-2.5 px-4 font-zentry text-lg hover:bg-gray-700/90 transition-all duration-300 border border-gray-700/40 flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        <span>Back</span>
                      </motion.button>

                      <motion.button
                        type="submit"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                        disabled={isLoading || !termsAccepted}
                        className={`w-full sm:w-48 py-2.5 px-4 font-zentry text-lg transition-all duration-300 flex items-center justify-center ${
                          isLoading || !termsAccepted
                            ? 'bg-gray-700/80 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg' 
                        }`}
                        whileHover={isLoading || !termsAccepted ? {} : { scale: 1.02 }}
                        whileTap={isLoading || !termsAccepted ? {} : { scale: 0.98 }}
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
              <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <a
                  href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`}
                  className="text-orange-500 hover:text-orange-400 transition-colors underline"
                >
                  Return to Login
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}