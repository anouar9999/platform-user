"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';
import { FaExclamationCircle } from 'react-icons/fa';

// Validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
  rememberMe: Yup.boolean()
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setServerMessage({ type: '', message: '' });
    setIsLoading(true);

    console.log('🔄 Login attempt:', {
      email: data.email,
      rememberMe: data.rememberMe,
      timestamp: new Date().toISOString()
    });

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_login.php`;

      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error('Backend URL is not configured');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password,
        }),
      });

      const responseText = await response.text();
      const result = JSON.parse(responseText);

      if (!response.ok) {
        // Handle specific status codes
        switch (response.status) {
          case 401:
            setError('password', { message: result?.message || 'Invalid credentials' });
            throw new Error(result?.message || 'Invalid email or password');
          case 400:
            throw new Error(result?.message || 'Invalid request');
          default:
            throw new Error(result?.message || `Login failed with status ${response.status}`);
        }
      }

      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      // Store auth data
      const authData = {
        sessionToken: result.session_token || null,
        userId: result.user_id,
        username: result.username,
        userType: result.user_type || 'user',
        avatarUrl: result.avatar || null,
        timestamp: new Date().getTime()
      };

      localStorage.setItem('authData', JSON.stringify(authData));

      setServerMessage({
        type: 'success',
        message: `Welcome back, ${result.username}! Redirecting...`,
      });

      // Redirect after success
      setTimeout(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/choose-to`;
      }, 1500);

    } catch (error) {
      console.error('❌ Login error:', error);
      setServerMessage({
        type: 'error',
        message: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const formItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center bg-black px-4 font-circular-web"
      style={{ 
        backgroundImage: 'url(https://lolstatic-a.akamaihd.net/rso-authenticator-ui/0.87.4/assets/riot_desktop_background_2x.jpg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/80"></div>
      
      {/* Logo */}
      
 {serverMessage.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 z-50 rounded-lg flex items-start ${
                serverMessage.type === 'success'
                  ? 'bg-green-900/30 border border-green-700'
                  : 'bg-red-900/30 border border-red-700'
              }`}
            >
              <FaExclamationCircle className={`h-5 w-5 mr-3 mt-0.5 ${
                serverMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`} />
              <p className={`text-sm ${
                serverMessage.type === 'success' ? 'text-green-300' : 'text-red-300'
              }`}>
                {serverMessage.message}
              </p>
            </motion.div>
          )}
      {/* Login Card */}
      <motion.div
        className="relative w-full max-w-md bg-secondary backdrop-blur-sm shadow-2xl border border-gray-800/50 z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="p-8">
          {/* Server Message */}
         

          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              className="space-y-6"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="mx-auto w-36 z-50">
        <img
          src="/images/logo-gamius-white.png"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>
              {/* Header */}
              <motion.div variants={formItemVariants} className="text-center mb-8">
                <h2 className="text-3xl font-zentry text-white mb-2">Se connecter</h2>
                <p className="text-gray-400 text-sm font-circular-web">Accédez à votre compte</p>
              </motion.div>

              {/* Email Input */}
              <motion.div variants={formItemVariants}>
                <label className="block text-white text-sm font-medium mb-2">
                  Adresse e-mail
                </label>
                <div className="relative group">
                 
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="votre@email.com"
                              className="w-full px-4 py-3 bg-dark text-white focus:outline-none font-circular-web"
                  />
                </div>
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2 ml-1 flex items-center"
                  >
                    <FaExclamationCircle className="h-3.5 w-3.5 mr-1.5" />
                    {errors.email.message}
                  </motion.div>
                )}
              </motion.div>

              {/* Password Input */}
              <motion.div variants={formItemVariants}>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-white text-sm font-circular-web">
                    Mot de passe
                  </label>
                  <a 
                    href="/forgot-password" 
                    className="text-orange-500 hover:text-orange-400 transition-colors text-sm font-circular-web"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative group">
                
                  <input
                    {...register('password')}
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                              className="w-full px-4 py-3 bg-dark text-white focus:outline-none font-circular-web"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2 ml-1 flex items-center"
                  >
                    <FaExclamationCircle className="h-3.5 w-3.5 mr-1.5" />
                    {errors.password.message}
                  </motion.div>
                )}
              </motion.div>

              {/* Remember Me */}
              <motion.div variants={formItemVariants} className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300 cursor-pointer">
                  Se souvenir de moi
                </label>
              </motion.div>

              {/* Login Button */}
              <motion.div variants={formItemVariants}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4  font-zentry text-lg uppercase transition-all duration-300 flex items-center justify-center ${
                    isLoading
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 shadow-lg shadow-orange-600/20'
                  } text-white`}
                  
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div variants={formItemVariants} className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-gray-400 bg-gray-900">OU</span>
                </div>
              </motion.div>

              {/* Social Login */}
              <motion.div variants={formItemVariants} className="grid grid-cols-4 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center p-3 bg-white hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <img src="https://auth.gbarena.com/assets/social-media-icons/facebook-icon.svg" alt="Facebook" className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center p-3 bg-white hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <img src="https://auth.gbarena.com/assets/social-media-icons/riot-icon.svg" alt="Riot" className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center p-3 bg-white hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <img src="https://auth.gbarena.com/assets/social-media-icons/google-icon.svg" alt="Google" className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center p-3 bg-white hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <img src="https://auth.gbarena.com/assets/social-media-icons/discord-icon.svg" alt="Discord" className="w-6 h-6" />
                </button>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div variants={formItemVariants} className="mt-8 text-center">
                <p className="text-gray-400 text-sm mb-2">
                  Tu n as pas de compte ?
                </p>
                <a
                  href="/signup"
                  className="text-orange-500 hover:text-orange-400 hover:underline uppercase font-bold transition-colors text-sm"
                >
                  Créer un compte
                </a>
              </motion.div>

              {/* Footer Links */}
              <motion.div
                variants={formItemVariants}
                className="mt-8 flex justify-center space-x-4 text-xs text-gray-500"
              >
                <a href="#" className="hover:text-gray-400 transition-colors">Aide</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Politique</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Modalités</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
              </motion.div>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}