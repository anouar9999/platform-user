"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  EyeIcon,
  EyeOffIcon,
  X as CloseIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  User as UserIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-react';

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [rememberMe, setRememberMe] = useState(false);
  const [welcomeAnimation, setWelcomeAnimation] = useState(true);
  const router = useRouter();
  
  // Hide welcome animation after it plays
  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Define validation schemas
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });
  
  const signupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    nickname: Yup.string()
      .min(3, 'Nickname must be at least 3 characters')
      .max(20, 'Nickname must be less than 20 characters')
      .required('Nickname is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });
  
  const loginInitialValues = {
    email: '',
    password: ''
  };
  
  const signupInitialValues = {
    email: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      console.log(`${activeTab === 'login' ? 'Login' : 'Signup'} attempt with:`, values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set success message
      setServerMessage({
        type: 'success',
        message: activeTab === 'login' ? 'Login successful! Redirecting you...' : 'Account created successfully! Redirecting you...'
      });
      
      // Reset form after successful submission
      resetForm();
      
      // Simulate redirect after successful login/signup
      setTimeout(() => {
        router.push('/tournaments');
      }, 1500);
    } catch (error) {
      console.error(`${activeTab === 'login' ? 'Login' : 'Signup'} error:`, error);
      setServerMessage({
        type: 'error',
        message: error.message || `An error occurred during ${activeTab === 'login' ? 'login' : 'signup'}`
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Animation variants for tab transitions
  const tabVariants = {
    hidden: (direction) => ({
      x: direction === 'right' ? 30 : -30,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: (direction) => ({
      x: direction === 'right' ? -30 : 30,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    })
  };
  
  // CSS animation for the background gradient
  const animatedGradientStyle = `
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-slow {
      background-size: 200% 200%;
      animation: gradientAnimation 15s ease infinite;
    }
  `;
  
  // Animation variants for form elements (staggered entrance)
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
  
  // Track animation direction
  const [direction, setDirection] = useState('right');
  
  // Change tab with animation direction
  const changeTab = (tab) => {
    if (tab === activeTab) return;
    
    setDirection(tab === 'signup' ? 'right' : 'left');
    setActiveTab(tab);
    
    // Clear any server messages when switching tabs
    setServerMessage({ type: '', message: '' });
  };

  // Welcome animation
  const welcomeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      scale: 1.2, 
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  // Function to determine password strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'Too weak', color: 'bg-gray-300' };
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Strength categories
    if (strength <= 2) return { strength: 1, label: 'Too weak', color: 'bg-red-500' };
    if (strength <= 4) return { strength: 2, label: 'Could be stronger', color: 'bg-yellow-500' };
    if (strength <= 5) return { strength: 3, label: 'Strong', color: 'bg-blue-500' };
    return { strength: 4, label: 'Very strong', color: 'bg-green-500' };
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      {/* Inject animated gradient CSS */}
      <style dangerouslySetInnerHTML={{ __html: animatedGradientStyle }} />
      {/* Welcome animation overlay */}
      <AnimatePresence>
        {welcomeAnimation && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            variants={welcomeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-white text-5xl font-bold">PLAY</span>
                <span className="text-orange-500 text-5xl font-bold ml-2">WASTE</span>
              </div>
              <p className="text-gray-400 text-xl">Welcome to gaming excellence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main background with improved blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: "url('https://play.toornament.com/media/8589365634683617280/original')",
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          filter: 'blur(8px)',
        }}
      />
      
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-blue-900/30 animate-gradient-slow"></div>
      
      {/* Auth modal with refined design */}
      <motion.div 
        className="relative w-full max-w-5xl mx-auto bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden z-10 border border-gray-800/50"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Modal layout - split design */}
        <div className="flex flex-col md:flex-row">
          {/* Left side - Character image */}
          {activeTab === 'login' && (
            <motion.div 
              className="md:w-5/12 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="https://play.toornament.com/media/8589365634683617280/original" 
                alt="Game character" 
                className="w-full h-full object-cover"
              />
              {/* Improved logo overlay with refined gradient */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-center">
                  <span className="text-white text-3xl font-bold">PLAY</span>
                  <span className="text-orange-500 text-3xl font-bold ml-1">WASTE</span>
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  The ultimate gaming platform for champions.
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Right side - Auth form with better spacing and animations */}
          <div className={`${activeTab === 'login' ? 'w-7/12' : 'w-full'} bg-gray-900/90 p-8`}>
            {/* Close button with improved hover effects */}
            <div className="flex justify-end mb-4">
              <motion.button 
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CloseIcon size={20} />
              </motion.button>
            </div>
            
            {/* Tab navigation with enhanced styling */}
            <div className="flex mb-8 border-b border-gray-800">
              <motion.button
                className={`py-3 px-6 font-medium text-lg relative ${activeTab === 'login' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => changeTab('login')}
                whileHover={{ scale: activeTab !== 'login' ? 1.05 : 1 }}
              >
                Login
                {activeTab === 'login' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-orange-400"
                    layoutId="activeTab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
              <motion.button
                className={`py-3 px-6 font-medium text-lg relative ${activeTab === 'signup' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => changeTab('signup')}
                whileHover={{ scale: activeTab !== 'signup' ? 1.05 : 1 }}
              >
                Sign Up
                {activeTab === 'signup' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-orange-400"
                    layoutId="activeTab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </div>
            
            {/* Server Message Display with improved styling and animations */}
            <AnimatePresence>
              {serverMessage.message && (
                <motion.div 
                  className={`mb-6 p-4 rounded-lg ${
                    serverMessage.type === 'error' ? 'bg-red-900/40 text-red-200 border border-red-700/50' : 
                    serverMessage.type === 'success' ? 'bg-green-900/40 text-green-200 border border-green-700/50' : ''
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    {serverMessage.type === 'success' ? (
                      <CheckCircleIcon className="h-5 w-5 mr-2 text-green-400 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 mr-2 text-red-400 mt-0.5">⚠️</div>
                    )}
                    <div className="flex-1">{serverMessage.message}</div>
                    <button 
                      onClick={() => setServerMessage({ type: '', message: '' })} 
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms with AnimatePresence for better transitions */}
            <AnimatePresence mode="wait" custom={direction}>
              {/* Login Form */}
              {activeTab === 'login' && (
                <motion.div
                  key="login-form"
                  custom={direction}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Formik
                    initialValues={loginInitialValues}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, values, handleChange, handleBlur }) => (
                      <Form>
                        <motion.div 
                          className="space-y-5"
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {/* Email Input with icon */}
                          <motion.div variants={formItemVariants}>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MailIcon className="h-5 w-5 text-gray-500" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Your email address"
                                className="w-full pl-10 pr-3 py-3 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-gray-700/50 transition-all"
                              />
                            </div>
                            {touched.email && errors.email && (
                              <div className="text-red-500 text-xs mt-1 ml-1">{errors.email}</div>
                            )}
                          </motion.div>

                          {/* Password Input with icon */}
                          <motion.div variants={formItemVariants}>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockIcon className="h-5 w-5 text-gray-500" />
                              </div>
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Your password"
                                className="w-full pl-10 pr-10 py-3 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-gray-700/50 transition-all"
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                              >
                                {showPassword ? (
                                  <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            {touched.password && errors.password && (
                              <div className="text-red-500 text-xs mt-1 ml-1">{errors.password}</div>
                            )}
                          </motion.div>

                          {/* Remember me & Forgot password */}
                          <motion.div 
                            className="flex items-center justify-between"
                            variants={formItemVariants}
                          >
                            <div className="flex items-center">
                              <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="h-4 w-4 text-orange-500 border-gray-600 rounded bg-gray-700 focus:ring-orange-500"
                              />
                              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                Remember me
                              </label>
                            </div>
                            <div className="text-sm">
                              <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
                                Forgot password?
                              </a>
                            </div>
                          </motion.div>

                          {/* Login Button with enhanced animation */}
                          <motion.div variants={formItemVariants}>
                            <motion.button
                              type="submit"
                              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium
                                hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-orange-600/20
                                disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                              disabled={isLoading}
                              whileHover={{ scale: isLoading ? 1 : 1.02 }}
                              whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            >
                              {isLoading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Logging in...
                                </>
                              ) : (
                                'Sign in to your account'
                              )}
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              )}
              
              {/* Sign Up Form with enhanced UX */}
              {activeTab === 'signup' && (
                <motion.div
                  key="signup-form"
                  custom={direction}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Formik
                    initialValues={signupInitialValues}
                    validationSchema={signupSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, values, handleChange, handleBlur }) => {
                      const passwordStrength = getPasswordStrength(values.password);
                      
                      return (
                        <Form>
                          <motion.div 
                            className="space-y-5"
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {/* Email Input with icon */}
                            <motion.div variants={formItemVariants}>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <MailIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                  type="email"
                                  name="email"
                                  value={values.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Your email address"
                                  className="w-full pl-10 pr-3 py-3 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-gray-700/50 transition-all"
                                />
                              </div>
                              {touched.email && errors.email && (
                                <div className="text-red-500 text-xs mt-1 ml-1">{errors.email}</div>
                              )}
                            </motion.div>
                            
                            {/* Nickname Input with icon */}
                            <motion.div variants={formItemVariants}>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Nickname</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <UserIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                  type="text"
                                  name="nickname"
                                  value={values.nickname}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Choose a nickname"
                                  className="w-full pl-10 pr-3 py-3 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-gray-700/50 transition-all"
                                />
                              </div>
                              {touched.nickname && errors.nickname && (
                                <div className="text-red-500 text-xs mt-1 ml-1">{errors.nickname}</div>
                              )}
                              {!errors.nickname && values.nickname && (
                                <div className="text-green-500 text-xs mt-1 ml-1 flex items-center">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" /> Nickname available
                                </div>
                              )}
                            </motion.div>

                            {/* Password Input with strength meter */}
                            <motion.div variants={formItemVariants}>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <LockIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  value={values.password}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Create a strong password"
                                  className="w-full pl-10 pr-10 py-3 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-gray-700/50 transition-all"
                                />
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                                >
                                  {showPassword ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                  ) : (
                                    <EyeIcon className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                              
                              {/* Password strength meter */}
                              {values.password && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="text-xs text-gray-400">Password strength:</div>
                                    <div className={`text-xs ${
                                      passwordStrength.strength <= 1 ? 'text-red-400' : 
                                      passwordStrength.strength === 2 ? 'text-yellow-400' : 
                                      passwordStrength.strength === 3 ? 'text-blue-400' : 
                                      'text-green-400'
                                    }`}>{passwordStrength.label}</div>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                      className={`h-full ${passwordStrength.color}`}
                                      initial={{ width: '0%' }}
                                      animate={{ width: `${passwordStrength.strength * 25}%` }}
                                      transition={{ duration: 0.3 }}
                                    ></motion.div>
                                  </div>
                                </div>
                              )}
                              
                              {touched.password && errors.password && (
                                <div className="text-red-500 text-xs mt-1 ml-1">{errors.password}</div>
                              )}
                            </motion.div>
                            
                            {/* Confirm Password Input */}
                            <motion.div variants={formItemVariants}>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <LockIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                  type={showConfirmPassword ? "text" : "password"}
                                  name="confirmPassword"
                                  value={values.confirmPassword}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Confirm your password"
                                  className="w-full pl-10 pr-10 py-3 bg-gray-800/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-gray-700/50 transition-all"
                                />
                                <button
                                  type="button"
                                  onClick={toggleConfirmPasswordVisibility}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                  ) : (
                                    <EyeIcon className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                              {touched.confirmPassword && errors.confirmPassword && (
                                <div className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</div>
                              )}
                              {!errors.confirmPassword && values.confirmPassword && values.password === values.confirmPassword && (
                                <div className="text-green-500 text-xs mt-1 ml-1 flex items-center">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" /> Passwords match
                                </div>
                              )}
                            </motion.div>

                            {/* Terms of Service Agreement */}
                            <motion.div variants={formItemVariants} className="mt-4">
                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-500 border-gray-600 rounded bg-gray-700 focus:ring-orange-500"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="terms" className="text-gray-400">
                                    I agree to the <a href="#" className="text-orange-500 hover:text-orange-400">Terms of Service</a> and <a href="#" className="text-orange-500 hover:text-orange-400">Privacy Policy</a>
                                  </label>
                                </div>
                              </div>
                            </motion.div>

                            {/* Sign Up Button */}
                            <motion.div variants={formItemVariants}>
                              <motion.button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium
                                  hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-orange-600/20
                                  disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                              >
                                {isLoading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                  </>
                                ) : (
                                  'Create account'
                                )}
                              </motion.button>
                            </motion.div>
                          </motion.div>
                        </Form>
                      );
                    }}
                  </Formik>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Divider with OR - enhanced with gradient */}
            <div className="flex items-center my-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <div className="px-4 text-gray-400 text-sm font-medium">OR</div>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>
            
            {/* Social login buttons with enhanced hover effects */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <motion.button 
                className="flex-1 flex items-center justify-center py-3 px-4 bg-gray-800/80 rounded-lg border border-gray-700/50 hover:bg-gray-700/80 transition-colors"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(55, 65, 81, 0.9)' }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.9999 11.9994C21.9999 11.3255 21.9404 10.6516 21.8213 9.99939H11.9999V13.2505H17.6249C17.3811 14.4015 16.7086 15.3994 15.7108 16.0734V18.5732H19.0915C21.0804 16.7621 21.9999 14.5945 21.9999 11.9994Z" fill="#4285F4"/>
                  <path d="M12 22C14.7 22 16.96 21.08 18.68 19.56L15.3 17.06C14.36 17.7 13.24 18.08 12 18.08C9.24 18.08 6.92 16.22 6.12 13.7H2.62V16.28C4.32 19.76 7.88 22 12 22Z" fill="#34A853"/>
                  <path d="M6.12 13.7C5.92 13.08 5.8 12.42 5.8 11.74C5.8 11.06 5.92 10.4 6.12 9.78V7.2H2.62C1.92 8.54 1.5 10.08 1.5 11.74C1.5 13.4 1.92 14.94 2.62 16.28L6.12 13.7Z" fill="#FBBC05"/>
                  <path d="M12 5.42C13.54 5.42 14.92 5.96 16 7.02L19 4.02C16.96 2.12 14.7 1 12 1C7.88 1 4.32 3.24 2.62 6.72L6.12 9.3C6.92 6.78 9.24 5.42 12 5.42Z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </motion.button>
              
              <motion.button 
                className="flex-1 flex items-center justify-center py-3 px-4 bg-gray-800/80 rounded-lg border border-gray-700/50 hover:bg-gray-700/80 transition-colors"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(55, 65, 81, 0.9)' }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.92 24C16.5 24 20.5 20.7 22.06 16.13L16.87 12.43C16.23 15.62 12.15 17.34 8.96 14.62L8.9 14.57L8.89 14.56L13 11.75L5.42 9.39V15.61C5.42 20.13 8.28 24 11.92 24Z" fill="#1A1A1A"/>
                  <path d="M11.91 0C15.56 0 18.83 2.33 19.87 5.93C20.18 6.95 20.33 8.03 20.33 9.13V10.87L11.91 6.26L3.5 10.87V9.13C3.5 4.08 7.23 0 11.91 0Z" fill="#231F20"/>
                </svg>
                Sign in with Steam
              </motion.button>
            </div>
            
            {/* Terms of service with enhanced readability */}
            <div className="text-gray-500 text-xs mt-8 text-center leading-relaxed">
              By continuing, you agree to the <a href="#" className="text-orange-500 hover:text-orange-400 hover:underline">Terms of Service</a> and acknowledge you have read our <a href="#" className="text-orange-500 hover:text-orange-400 hover:underline">Privacy Policy</a>. You must be at least 13 years old and are not a resident of any Restricted Territories.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}