"use client";
import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle as CheckCircleIcon,
  Shield as ShieldIcon,
  ShieldCheck as ShieldCheckIcon,
  UserPlus as UserPlusIcon,
  ArrowRight as ArrowRightIcon,
  ChevronLeft as ChevronLeftIcon
} from 'lucide-react';
import Loader from './Loader';
import { FaExclamationCircle } from 'react-icons/fa';
import ServerMessage from './ServerMessage';
import { SharedDataManager } from '@/utils/test';

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [rememberMe, setRememberMe] = useState(false);
  const [welcomeAnimation, setWelcomeAnimation] = useState(true);
  const [signupStep, setSignupStep] = useState(1); // New state for multi-step signup
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const sharedDataRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const updateAuthUI = (userData) => {
    console.log('Updating UI for authenticated user:', userData);
    setUserData(userData);
  };

  const clearAuthUI = () => {
    console.log('Clearing UI for logged out user');
    setActiveTab('login');
    setSignupStep(1);
    setUserData(null);
    setServerMessage({ type: '', message: '' });
  };

  const prefillFormData = (formData) => {
    console.log('Prefilling form with data from other window:', formData);
    // Implement form prefilling logic here if needed
  };

  // Initialize SharedDataManager
  useEffect(() => {
    console.log('🔧 AuthForm - Initializing SharedDataManager...');
    
    // Create SharedDataManager instance
    sharedDataRef.current = new SharedDataManager();
    
    // Subscribe to data changes
    unsubscribeRef.current = sharedDataRef.current.subscribe((type, key, value) => {
      console.log('🔧 AuthForm - Data change received:', { type, key, value });
      
      switch(type) {
        case 'set':
        case 'auth-success':
          if (key === 'authData') {
            updateAuthUI(value);
            setServerMessage({
              type: 'success',
              message: `Welcome back, ${value.username}! You're now logged in across all windows.`,
            });
          }
          break;
          
        case 'delete':
        case 'logout':
          if (key === 'authData' || type === 'logout') {
            clearAuthUI();
            setServerMessage({
              type: 'info',
              message: 'You have been logged out.',
            });
            localStorage.removeItem('authData');
          }
          break;
          
        case 'sync':
          // Handle initial data sync from other windows
          if (value && value.authData) {
            updateAuthUI(value.authData);
          }
          break;
      }
      
      // Handle signup form data prefilling
      if (key === 'signupFormData' && type === 'set') {
        prefillFormData(value);
      }
    });
    
    // Check for existing auth data with retry mechanism
    const checkAuthData = async (attempts = 0) => {
      console.log(`🔧 Checking auth data (attempt ${attempts + 1})...`);
      
      // First check SharedDataManager
      const existingAuthData = sharedDataRef.current.getAuthData();
      if (existingAuthData) {
        console.log('🔧 Found auth data in SharedDataManager:', existingAuthData);
        updateAuthUI(existingAuthData);
        return;
      }
      
      // Then check localStorage
      const localAuthData = localStorage.getItem('authData');
      if (localAuthData) {
        try {
          const parsed = JSON.parse(localAuthData);
          let userDataToSet = null;
          
          // Handle different localStorage structures
          if (parsed.username) {
            userDataToSet = parsed;
          } else if (parsed.user && parsed.user.username) {
            userDataToSet = parsed.user;
          } else if (parsed.data && parsed.data.username) {
            userDataToSet = parsed.data;
          }
          
          if (userDataToSet) {
            console.log('🔧 Found auth data in localStorage, syncing to SharedDataManager:', userDataToSet);
            sharedDataRef.current.setAuthData(userDataToSet);
            updateAuthUI(userDataToSet);
            return;
          }
        } catch (error) {
          console.error('🔧 Error parsing localStorage auth data:', error);
        }
      }
      
      // Retry mechanism for cross-window sync
      if (attempts < 3) {
        setTimeout(() => checkAuthData(attempts + 1), 200);
      } else {
        console.log('🔧 No auth data found after all attempts');
      }
    };
    
    // Start checking with a small delay to allow for message passing
    setTimeout(() => checkAuthData(), 100);
    
    // Cleanup function
    return () => {
      console.log('🔧 AuthForm - Cleaning up SharedDataManager...');
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (sharedDataRef.current) {
        sharedDataRef.current.destroy();
      }
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    console.log('🔧 AuthForm - Handling logout...');
    
    // Clear SharedDataManager (this will sync to other windows)
    sharedDataRef.current?.clearAuthData();
    
    // Clear localStorage
    localStorage.removeItem('authData');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    
    // Clear local state
    clearAuthUI();
    
    setServerMessage({
      type: 'info',
      message: 'You have been logged out successfully.',
    });
  };

  // Render auth status
  const renderAuthStatus = () => {
    if (userData) {
      return (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {userData.avatarUrl && (
                <img 
                  src={userData.avatarUrl} 
                  alt="User avatar" 
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <span className="text-green-400 text-sm">
                Logged in as {userData.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-xs underline"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
    return null;
  };


  // Define validation schemas
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // Split signup validation schemas for multi-step form
  const signupSchema1 = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const signupSchema3 = Yup.object().shape({
    username: Yup.string().required('username is required'),
  });

  const signupSchema2 = Yup.object().shape({
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

  const getValidationSchema = () => {
    switch(signupStep) {
      case 1: return signupSchema1; // email
      case 2: return signupSchema3; // username
      case 3: return signupSchema2; // password
      case 4: return Yup.object().shape({
        termsAccepted: Yup.boolean().oneOf([true], 'You must accept the terms and conditions')
      }); // terms
      default: return signupSchema1;
    }
  };

  const loginInitialValues = {
    email: '',
    password: ''
  };

  const signupInitialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    termsAccepted: false
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      // File size validation (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setServerMessage({
          type: 'error',
          message: 'File size should be less than 5MB',
        });
        return;
      }

      // File type validation
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setServerMessage({
          type: 'error',
          message: 'Please upload a valid image file (JPG, PNG, or GIF)',
        });
        return;
      }

      console.log('Selected file:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // Set file in form values
      setFieldValue('avatar', file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
  // Step tracking for better debugging
  const logStep = (step, data = {}) => {
    console.log(`🔄 Auth Step: ${step}`, {
      timestamp: new Date().toISOString(),
      activeTab,
      signupStep,
      ...data
    });
  };

  // Clear any existing server messages
  setServerMessage({ type: '', message: '' });
  setIsLoading(true);
  logStep('FORM_SUBMISSION_START', { isLogin: activeTab === 'login' });

  const isLogin = activeTab === 'login';
  
  try {
    // Save form data to shared storage for multi-window form continuation
    if (!isLogin) {
      logStep('SAVING_SIGNUP_DATA_TO_SHARED_STORAGE');
      sharedDataRef.current?.set('signupFormData', values);
    }

    // Determine the endpoint
    const endpoint = isLogin ? 'user_login.php' : 'user_register.php';
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${endpoint}`;
    
    logStep('PREPARING_REQUEST', { 
      endpoint, 
      url,
      hasBackendUrl: !!process.env.NEXT_PUBLIC_BACKEND_URL 
    });

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
      throw new Error('Backend URL is not configured. Please check your environment variables.');
    }

    let response;
    let requestBody;

    if (isLogin) {
      // LOGIN FLOW
      logStep('LOGIN_REQUEST_PREPARATION');
      
      // Validate required fields
      if (!values.email || !values.password) {
        throw new Error('Email and password are required for login.');
      }

      requestBody = {
        email: values.email.trim(),
        password: values.password,
      };

      logStep('SENDING_LOGIN_REQUEST', { email: values.email });

      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include', // ✅ Now this will work with fixed backend
          body: JSON.stringify(requestBody),
        });

        logStep('LOGIN_RESPONSE_RECEIVED', { 
          status: response.status, 
          statusText: response.statusText,
          ok: response.ok 
        });

      } catch (networkError) {
        logStep('LOGIN_NETWORK_ERROR', { error: networkError.message });
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }

      // Parse response
      let responseText;
      try {
        responseText = await response.text();
        logStep('LOGIN_RESPONSE_TEXT_RECEIVED', { 
          hasResponse: !!responseText,
          responseLength: responseText?.length 
        });
      } catch (parseError) {
        logStep('LOGIN_RESPONSE_PARSE_ERROR', { error: parseError.message });
        throw new Error('Failed to read server response. Please try again.');
      }

      let data;
      try {
        data = JSON.parse(responseText);
        logStep('LOGIN_RESPONSE_PARSED', { 
          hasData: !!data,
          success: data?.success,
          hasMessage: !!data?.message 
        });
      } catch (jsonError) {
        logStep('LOGIN_JSON_PARSE_ERROR', { 
          error: jsonError.message,
          responseText: responseText?.substring(0, 200) 
        });
        throw new Error('Invalid server response format. Please contact support if this persists.');
      }

      // Handle login response
      if (!response.ok) {
        logStep('LOGIN_HTTP_ERROR', { 
          status: response.status,
          message: data?.message 
        });
        
        // Handle specific HTTP status codes
        switch (response.status) {
          case 400:
            throw new Error(data?.message || 'Invalid request. Please check your credentials.');
          case 401:
            throw new Error(data?.message || 'Invalid email or password.');
          case 403:
            throw new Error(data?.message || 'Account access forbidden. Please contact support.');
          case 404:
            throw new Error('Login service not found. Please contact support.');
          case 429:
            throw new Error('Too many login attempts. Please wait a few minutes and try again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(data?.message || `Login failed with status ${response.status}`);
        }
      }

      if (!data.success) {
        logStep('LOGIN_API_ERROR', { message: data?.message });
        
        // Handle specific API error messages
        const errorMessage = data?.message?.toLowerCase() || '';
        if (errorMessage.includes('email')) {
          setFieldError('email', data.message);
        } else if (errorMessage.includes('password')) {
          setFieldError('password', data.message);
        }
        
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Validate response data structure
      if (!data.username || !data.user_id) {
        logStep('LOGIN_INVALID_RESPONSE_STRUCTURE', { 
          hasUsername: !!data.username,
          hasUserId: !!data.user_id 
        });
        throw new Error('Invalid login response. Please try again.');
      }

      logStep('LOGIN_SUCCESS', { 
        username: data.username,
        userId: data.user_id,
        userType: data.user_type 
      });

      // Prepare user data
      const userData = {
        username: data.username,
        avatarUrl: data.avatar || null,
        userId: data.user_id,
        userType: data.user_type || 'user',
        sessionToken: data.session_token || null
      };

      // Store in localStorage with proper structure
      const authDataForStorage = {
        sessionToken: data.session_token || null,
        userId: data.user_id,
        username: data.username,
        userType: data.user_type || 'user',
        avatarUrl: data.avatar || null,
        timestamp: new Date().getTime()
      };
      
      try {
        localStorage.setItem('authData', JSON.stringify(authDataForStorage));
        logStep('LOGIN_DATA_STORED_LOCALLY');
      } catch (storageError) {
        logStep('LOGIN_STORAGE_ERROR', { error: storageError.message });
        console.warn('Failed to store auth data locally:', storageError);
      }

      // Store in SharedDataManager (this will sync to other windows)
      try {
        sharedDataRef.current?.setAuthData(userData);
        logStep('LOGIN_DATA_SHARED');
      } catch (sharedError) {
        logStep('LOGIN_SHARED_STORAGE_ERROR', { error: sharedError.message });
        console.warn('Failed to share auth data:', sharedError);
      }
      
      // Update local state
      updateAuthUI(userData);

      setServerMessage({
        type: 'success',
        message: `Welcome back, ${data.username}! Redirecting to home...`,
      });

      logStep('LOGIN_REDIRECT_INITIATED');
      
      // Redirect to Vite app
      setTimeout(() => {

        window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}:3000/choose-to`; // ✅ Redirect to your Vite app
        try {
          logStep('LOGIN_REDIRECT_EXECUTED');
        } catch (redirectError) {
          logStep('LOGIN_REDIRECT_ERROR', { error: redirectError.message });
          console.error('Redirect failed:', redirectError);
        }
      }, 1500);

    } else {
      // REGISTRATION FLOW
      logStep('REGISTRATION_REQUEST_PREPARATION', { currentStep: signupStep });
      
      // Validate required fields for registration
      const requiredFields = ['username', 'email', 'password'];
      const missingFields = requiredFields.filter(field => !values[field]);
      
      if (missingFields.length > 0) {
        logStep('REGISTRATION_MISSING_FIELDS', { missingFields });
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      if (values.password !== values.confirmPassword) {
        logStep('REGISTRATION_PASSWORD_MISMATCH');
        setFieldError('confirmPassword', 'Passwords do not match');
        throw new Error('Passwords do not match');
      }

      if (!values.termsAccepted) {
        logStep('REGISTRATION_TERMS_NOT_ACCEPTED');
        setFieldError('termsAccepted', 'You must accept the terms and conditions');
        throw new Error('You must accept the terms and conditions');
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('username', values.username.trim());
      formData.append('email', values.email.trim());
      formData.append('password', values.password);
      formData.append('bio', values.bio || '');
      formData.append('is_verified', '1');

      // Handle avatar upload
      if (values.avatar && values.avatar instanceof File) {
        logStep('REGISTRATION_AVATAR_PROCESSING', { 
          fileName: values.avatar.name,
          fileSize: values.avatar.size,
          fileType: values.avatar.type 
        });
        
        // Validate file size (5MB limit)
        if (values.avatar.size > 5 * 1024 * 1024) {
          throw new Error('Avatar file size must be less than 5MB');
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(values.avatar.type)) {
          throw new Error('Avatar must be a valid image file (JPG, PNG, GIF, or WebP)');
        }
        
        formData.append('avatar', values.avatar, values.avatar.name);
      }

      logStep('SENDING_REGISTRATION_REQUEST', { 
        username: values.username,
        email: values.email,
        hasAvatar: !!values.avatar 
      });

      try {
        response = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include', // ✅ Now this will work with fixed backend
        });

        logStep('REGISTRATION_RESPONSE_RECEIVED', { 
          status: response.status, 
          statusText: response.statusText,
          ok: response.ok 
        });

      } catch (networkError) {
        logStep('REGISTRATION_NETWORK_ERROR', { error: networkError.message });
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }

      // Parse registration response
      let responseText;
      try {
        responseText = await response.text();
        logStep('REGISTRATION_RESPONSE_TEXT_RECEIVED', { 
          hasResponse: !!responseText,
          responseLength: responseText?.length 
        });
      } catch (parseError) {
        logStep('REGISTRATION_RESPONSE_PARSE_ERROR', { error: parseError.message });
        throw new Error('Failed to read server response. Please try again.');
      }

      let data;
      try {
        data = JSON.parse(responseText);
        logStep('REGISTRATION_RESPONSE_PARSED', { 
          hasData: !!data,
          success: data?.success,
          hasMessage: !!data?.message 
        });
      } catch (jsonError) {
        logStep('REGISTRATION_JSON_PARSE_ERROR', { 
          error: jsonError.message,
          responseText: responseText?.substring(0, 200) 
        });
        throw new Error('Invalid server response format. Please contact support if this persists.');
      }

      // Handle registration response
      if (!response.ok) {
        logStep('REGISTRATION_HTTP_ERROR', { 
          status: response.status,
          message: data?.message 
        });
        
        // Handle specific HTTP status codes
        switch (response.status) {
          case 400:
            throw new Error(data?.message || 'Invalid registration data. Please check your information.');
          case 409:
            const conflictMessage = data?.message?.toLowerCase() || '';
            if (conflictMessage.includes('email')) {
              setFieldError('email', 'This email is already registered');
            } else if (conflictMessage.includes('username')) {
              setFieldError('username', 'This username is already taken');
            }
            throw new Error(data?.message || 'Email or username already exists.');
          case 413:
            throw new Error('File too large. Please choose a smaller avatar image.');
          case 415:
            throw new Error('Invalid file type. Please upload a valid image file.');
          case 429:
            throw new Error('Too many registration attempts. Please wait a few minutes and try again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(data?.message || `Registration failed with status ${response.status}`);
        }
      }

      if (!data.success) {
        logStep('REGISTRATION_API_ERROR', { message: data?.message });
        
        // Handle specific API error messages
        const errorMessage = data?.message?.toLowerCase() || '';
        if (errorMessage.includes('email')) {
          setFieldError('email', data.message);
        } else if (errorMessage.includes('username')) {
          setFieldError('username', data.message);
        } else if (errorMessage.includes('password')) {
          setFieldError('password', data.message);
        }
        
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      logStep('REGISTRATION_SUCCESS', { 
        message: data.message,
        userId: data.user_id 
      });

      // Clear signup form data after successful registration
      try {
        sharedDataRef.current?.delete('signupFormData');
        logStep('REGISTRATION_CLEANUP_COMPLETED');
      } catch (cleanupError) {
        logStep('REGISTRATION_CLEANUP_ERROR', { error: cleanupError.message });
        console.warn('Failed to clean up signup form data:', cleanupError);
      }
      
      setServerMessage({
        type: 'success',
        message: 'Account created successfully! You can now log in.',
      });

      // Switch to login tab after successful registration
      setTimeout(() => {
        setActiveTab('login');
        setSignupStep(1);
        setIsLoading(false);
        logStep('REGISTRATION_SWITCHED_TO_LOGIN');
      }, 2000);
    }

  } catch (error) {
    logStep('FORM_SUBMISSION_ERROR', { 
      error: error.message,
      stack: error.stack?.substring(0, 500) 
    });
    
    console.error('Authentication error:', {
      message: error.message,
      stack: error.stack,
      isLogin,
      signupStep,
      timestamp: new Date().toISOString()
    });

    // Set appropriate error message
    let errorMessage = error.message;
    
    // Fallback error messages
    if (!errorMessage || errorMessage === 'Failed to fetch') {
      errorMessage = isLogin 
        ? 'Unable to connect to login service. Please check your internet connection and try again.'
        : 'Unable to connect to registration service. Please check your internet connection and try again.';
    }

    setServerMessage({
      type: 'error',
      message: errorMessage,
    });

  } finally {
    logStep('FORM_SUBMISSION_COMPLETE');
    setIsLoading(false);
    setSubmitting(false);
  }
};

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Function to handle avatar selection
  const handleAvatarChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue('avatar', file);
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

  // Step transition animation variants
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
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
    
    .avatar-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.6);
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: 50%;
    }
    
    .avatar-container:hover .avatar-overlay {
      opacity: 1;
    }
    
    .form-step-progress {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      z-index: 1;
    }
    
    .form-step-progress::before {
      content: '';
      position: absolute;
      height: 2px;
      background-color: #374151;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      z-index: -1;
    }
    
    .form-step-progress-bar {
      position: absolute;
      height: 2px;
      background: linear-gradient(to right, #ea580c, #f97316);
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: -1;
      transition: width 0.4s ease;
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
    setSignupStep(1); // Reset signup step when changing tabs

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

  // Get step progress percentage for the progress bar
  const getStepProgressPercentage = () => {
    return ((signupStep - 1) / 2) * 100 + '%';
  };

  if (isLoading) {
    return (
      <Loader
        message={"Processing..."}
        username={"User"}
        logo="/images/logo-gamius-white.png"
        logoAlt="Gamius Logo"
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-around bg-black"
      style={{ backgroundImage: 'url(https://lolstatic-a.akamaihd.net/rso-authenticator-ui/0.87.4/assets/riot_desktop_background_2x.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-secondary/80 "></div>
      
      {/* ✅ Add auth status display */}
      {/* <div className="absolute top-4 right-4 z-50">
        {renderAuthStatus()}
      </div> */}

      {/* Inject animated gradient CSS */}
      <style dangerouslySetInnerHTML={{ __html: animatedGradientStyle }} />

      <div className={`${activeTab === 'signup' ? 'absolute top-0 left-4' : ''} w-36 z-50 mt-7  overflow-hidden`}>
        <img
          src="/images/logo-gamius-white.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Auth modal with refined design */}
      <motion.div
        className={`relative w-full ${activeTab === 'signup' ? 'max-w-6xl' : 'max-w-md'} mx-auto bg-secondary shadow-2xl overflow-hidden z-10 border border-gray-800/50`}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Modal layout - split design for signup, single column for login */}
        <div className={`flex flex-col ${activeTab === 'signup' ? 'md:flex-row' : ''} min-h-[600px]`}>
          {/* Left side - Big Title (Only for Signup) */}
          {activeTab === 'signup' && (
            <motion.div
              className="md:w-5/12 relative min-h-[600px] m-8 flex items-end tracking-widest justify-around"
              initial={{ opacity: 0, x: -20 }}
              style={{
                backgroundImage: 'url(https://lolstatic-a.akamaihd.net/rso-authenticator-ui/0.87.4/assets/arcane_dsktp_rightAlignedCard_BG_2x.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center z-50">
                <h1 className="text-5xl font-black  uppercase tracking-wider font-free-fire  mb-4 text-orange-mge  ">Créer un compte</h1>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-b z-10 from-secondary/20 to-secondary `}
              ></div>
            </motion.div>
          )}

          {/* Right side - Auth form */}
          <div className={`${activeTab === 'signup' ? 'md:w-7/12' : 'w-full'} p-6 min-h-[600px] overflow-y-auto`}>
            {/* Server Message Component */}
            <ServerMessage 
              message={serverMessage.message} 
              type={serverMessage.type} 
              onClose={() => setServerMessage({ type: '', message: '' })} 
            />

            {/* Forms with AnimatePresence for better transitions */}
            <AnimatePresence mode="wait" custom={direction}>
              {/* Your existing login and signup form JSX remains exactly the same */}
              {/* I'm keeping all your form structure and animations */}
              
              {/* Login Form */}
              {activeTab === 'login' && (
                <motion.div
                  key="login-form"
                  custom={direction}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-w-3xl mx-auto"
                >
                  <Formik
                    initialValues={loginInitialValues}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, values, handleChange, handleBlur }) => (
                      <Form>
                        {/* All your existing login form JSX */}
                        <motion.div
                          className="space-y-8"
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <motion.div
                            variants={formItemVariants}
                            className="text-center mb-6"
                          >
                            <h2 className="text-xl font-semibold text-white mb-6">Se connecter</h2>
                          </motion.div>

                          {/* Email Input */}
                          <motion.div variants={formItemVariants} className="mb-4">
                            <label className="block text-white text-sm font-medium mb-2">Adresse e-mail</label>
                            <input
                              type="email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Adresse e-mail"
                              className="w-full px-4 py-3 bg-dark text-white focus:outline-none"
                            />
                            {touched.email && errors.email && (
                              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                            )}
                          </motion.div>

                          {/* Password Input */}
                          <motion.div variants={formItemVariants} className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-white text-sm font-medium">Mot de passe</label>
                              <a href="/forgot-password" className="text-orange-500 hover:text-orange-400 transition-colors text-sm">
                                Mot de passe oublié ?
                              </a>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Mot de passe"
                                className="w-full px-4 py-3 bg-dark text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            {touched.password && errors.password && (
                              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                            )}
                          </motion.div>

                          {/* Login Button */}
                          <motion.div variants={formItemVariants} className="mt-6">
                            <button
                              type="submit"
                              className="w-full bg-orange-500 text-white py-3 font-medium uppercase
                  hover:bg-orange-600 transition-colors
                  disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                'SE CONNECTER'
                              )}
                            </button>
                          </motion.div>

                          {/* OR Divider */}
                          <motion.div variants={formItemVariants} className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <span className="px-4 text-sm text-gray-400 bg-secondary">OR</span>
                            </div>
                          </motion.div>

                          {/* Social Login Buttons */}
                          <motion.div variants={formItemVariants} className="grid grid-cols-4 gap-3 mb-6">
                            {/* Facebook */}
                            <button
                              type="button"
                              className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded"
                            >
                              <img src="https://auth.gbarena.com/assets/social-media-icons/facebook-icon.svg" alt="Facebook" className="w-6 h-6" />
                            </button>

                            {/* Discord */}
                            <button
                              type="button"
                              className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded"
                            >
                              <img src="https://auth.gbarena.com/assets/social-media-icons/riot-icon.svg" alt="Discord" className="w-6 h-6" />
                            </button>

                            {/* Google */}
                            <button
                              type="button"
                              className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded"
                            >
                              <img src="https://auth.gbarena.com/assets/social-media-icons/google-icon.svg" alt="Google" className="w-6 h-6" />
                            </button>

                            {/* Apple */}
                            <button
                              type="button"
                              className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded"
                            >
                              <img src="https://auth.gbarena.com/assets/social-media-icons/discord-icon.svg" alt="Apple" className="w-6 h-6" />
                            </button>
                          </motion.div>

                          {/* No account? Sign up link */}
                          <motion.div
                            variants={formItemVariants}
                            className="mt-8 text-center"
                          >
                            <p className="text-gray-400 text-sm mb-2">
                              Tu n as pas de compte ?
                            </p>
                            <button
                              type="button"
                              onClick={() => changeTab('signup')}
                              className="text-orange-mge hover:underline uppercase font-bold transition-colors text-sm"
                            >
                              CRÉER UN COMPTE
                            </button>
                          </motion.div>

                          {/* Footer */}
                          <motion.div
                            variants={formItemVariants}
                            className="mt-12 flex justify-center space-x-4 text-xs text-gray-500"
                          >
                            <a href="#" className="hover:text-gray-400">Aide</a>
                            <a href="#" className="hover:text-gray-400">Politique</a>
                            <a href="#" className="hover:text-gray-400">Modalités</a>
                            <a href="#" className="hover:text-gray-400">Paramètres des cookies</a>
                          </motion.div>
                        </motion.div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              )}

              {/* Sign Up Form with enhanced UX - Multi-step Form */}
              {activeTab === 'signup' && (
                <div>
                  <motion.div
                    key="signup-form"
                    custom={direction}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative"
                  >
                    <Formik
                      initialValues={signupInitialValues}
                      onSubmit={handleSubmit}
                      validationSchema={getValidationSchema()}
                    >
                      {({ errors, touched, values, handleChange, handleBlur, setFieldValue, isValid }) => {
                        const passwordStrength = getPasswordStrength(values.password);

                        return (
                          <Form className="relative">
                            {/* Form step indicator */}
                            <div className="mt-6 flex justify-center mb-8">
                              <div className="flex space-x-2 items-center">
                                <div className={`h-2 w-10 rounded-full ${signupStep >= 1 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                                <div className={`h-2 w-10 rounded-full ${signupStep >= 2 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                                <div className={`h-2 w-10 rounded-full ${signupStep >= 3 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                                <div className={`h-2 w-10 rounded-full ${signupStep >= 4 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                              </div>
                            </div>

                            {/* Step headers */}
                            <div className="text-center mb-6">
                              {signupStep === 1 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <h2 className="text-3xl font-ea-football tracking-widest text-white">Quelle est votre</h2>
                                  <h2 className="text-3xl font-ea-football tracking-wider text-white">adresse e-mail</h2>
                                  <p className="text-gray-400 font-pilot mt-2">Rassurez-vous, nous ne la donnerons à personne.</p>
                                </motion.div>
                              )}
                              {signupStep === 2 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <h2 className="text-3xl font-ea-football tracking-wide text-white">Choisissez un nom</h2>
                                  <h2 className="text-3xl font-ea-football tracking-wide text-white">d utilisateur</h2>
                                  <p className="text-gray-400 font-pilot mt-2">Utilisé pour vous connecter à tous nos jeux.</p>
                                </motion.div>
                              )}
                              {signupStep === 3 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <h2 className="text-3xl font-ea-football tracking-wider text-white">Choisissez un mot de passe</h2>
                                  <p className="text-gray-400 font-pilot mt-2">Trouvez-en un bon.</p>
                                </motion.div>
                              )}
                              {signupStep === 4 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <h2 className="text-3xl font-ea-football tracking-wider text-white">Almost Done!</h2>
                                  <p className="text-gray-400 font-pilot mt-2">Final touches before you join the community</p>
                                </motion.div>
                              )}
                            </div>

                            {/* Multi-step form content with animations */}
                            <AnimatePresence mode="wait">
                              {/* Step 1: Email */}
                              {signupStep === 1 && (
                                <motion.div
                                  key="step1"
                                  variants={stepVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="space-y-8 p-6"
                                >
                                  {/* Email Input with icon */}
                                  <motion.div variants={formItemVariants}>
                                    <label className="block text-gray-300 text-sm font-pilot mb-2">Email Address</label>
                                    <div className="relative group">
                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MailIcon className="h-5 w-5 text-orange-500 group-focus-within:text-orange-400 transition-colors" />
                                      </div>
                                      <input
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Your email address"
                                        className="w-full pl-10 pr-10 py-3 bg-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                      />
                                    </div>
                                    {touched.email && errors.email && (
                                      <div className="text-red-400 text-xs mt-2 ml-1 flex font-pilot items-center">
                                        <FaExclamationCircle className="h-3.5 w-3.5 mr-1.5" /> {errors.email}
                                      </div>
                                    )}
                                    {!errors.email && values.email && (
                                      <div className="text-green-400 text-xs mt-2 ml-1 flex font-pilot items-center">
                                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" /> Email available
                                      </div>
                                    )}

                                    {/* Newsletter Consent */}
                                    <div className="mt-8">
                                      <label className="flex items-start space-x-3 cursor-pointer group">
                                        <div className="relative flex items-start">
                                          <input
                                            type="checkbox"
                                            name="riotConsent"
                                            className="w-5 h-5 bg-gray-800 border-gray-600 rounded text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                                          />
                                        </div>
                                        <span className="text-sm text-gray-300 group-hover:text-white font-pilot transition-colors">
                                          Oui ; Riot peut m envoyer des informations concernant les nouvelles sorties, les mises à jour du jeu, les événements ou tout autre contenu Riot.
                                        </span>
                                      </label>
                                    </div>
                                  </motion.div>

                                  <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                      <div className="w-full border-t border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm font-bold">
                                      <span className="px-2 bg-secondary text-gray-400">Vous pouvez aussi créer un compte avec</span>
                                    </div>
                                  </div>

                                  {/* Social Login Buttons */}
                                  <motion.div variants={formItemVariants} className="grid grid-cols-4 gap-3 mb-6">
                                    <button type="button" className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded">
                                      <img src="https://auth.gbarena.com/assets/social-media-icons/facebook-icon.svg" alt="Facebook" className="w-6 h-6" />
                                    </button>
                                    <button type="button" className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded">
                                      <img src="https://auth.gbarena.com/assets/social-media-icons/riot-icon.svg" alt="Discord" className="w-6 h-6" />
                                    </button>
                                    <button type="button" className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded">
                                      <img src="https://auth.gbarena.com/assets/social-media-icons/google-icon.svg" alt="Google" className="w-6 h-6" />
                                    </button>
                                    <button type="button" className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 transition-colors rounded">
                                      <img src="https://auth.gbarena.com/assets/social-media-icons/discord-icon.svg" alt="Apple" className="w-6 h-6" />
                                    </button>
                                  </motion.div>

                                  {/* Next button */}
                                  <motion.div variants={formItemVariants} className="pt-3">
                                    <motion.button
                                      type="button"
                                      onClick={() => {
                                        if (!errors.email && values.email) {
                                          setSignupStep(2);
                                        }
                                      }}
                                      className={`w-full ${!errors.email && values.email
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400'
                                        : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                                        } text-white py-3.5 px-4 rounded-xl font-pilot uppercase
        transition-all duration-300 shadow-lg
        flex items-center justify-center mt-4`}
                                      whileHover={{
                                        scale: !errors.email && values.email ? 1.02 : 1
                                      }}
                                      whileTap={{
                                        scale: !errors.email && values.email ? 0.98 : 1
                                      }}
                                    >
                                      <span>Continue</span>
                                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </motion.button>
                                  </motion.div>
                                </motion.div>
                              )}

                              {/* Step 2: Username */}
                              {signupStep === 2 && (
                                <motion.div
                                  key="step2"
                                  variants={stepVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="space-y-8 p-6"
                                >
                                  <motion.div variants={formItemVariants}>
                                    <label className="block text-gray-300 text-sm font-pilot mb-2">Username</label>
                                    <div className="relative group">
                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-orange-500 group-focus-within:text-orange-400 transition-colors" />
                                      </div>
                                      <input
                                        type="text"
                                        name="username"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Your username"
                                        className="w-full pl-10 pr-10 py-3 bg-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                      />
                                    </div>
                                    {touched.username && errors.username && (
                                      <div className="text-red-400 text-xs mt-2 ml-1 flex font-pilot items-center">
                                        <FaExclamationCircle className="h-3.5 w-3.5 mr-1.5" /> {errors.username}
                                      </div>
                                    )}
                                    {!errors.username && values.username && (
                                      <div className="text-green-400 text-xs mt-2 ml-1 flex font-pilot items-center">
                                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" /> Username available
                                      </div>
                                    )}
                                  </motion.div>

                                  {/* Navigation buttons */}
                                  <motion.div variants={formItemVariants} className="grid grid-cols-2 gap-x-52 pt-4">
                                    <motion.button
                                      type="button"
                                      onClick={() => setSignupStep(1)}
                                      className="w-full bg-gray-800/80 text-gray-300 py-3.5 px-4 rounded-xl font-medium hover:bg-gray-700/90 transition-all duration-300 border border-gray-700/40 flex items-center justify-center shadow-md backdrop-blur-sm"
                                      whileHover={{ scale: 1.02, backgroundColor: "rgba(55, 65, 81, 0.9)" }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <ChevronLeftIcon className="h-5 w-5 mr-2 text-gray-400" />
                                      <span>Back</span>
                                    </motion.button>

                                    <motion.button
                                      type="button"
                                      onClick={() => {
                                        if (!errors.username && values.username) {
                                          setSignupStep(3);
                                        }
                                      }}
                                      className={`w-full ${!errors.username && values.username
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400'
                                        : 'bg-gray-700/80 text-gray-400 cursor-not-allowed'
                                        } text-white py-3.5 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center relative overflow-hidden group`}
                                    >
                                      <span>Continue</span>
                                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </motion.button>
                                  </motion.div>
                                </motion.div>
                              )}

                              {/* Step 3: Password */}
                              {signupStep === 3 && (
                                <motion.div
                                  key="step3"
                                  variants={stepVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="space-y-5"
                                >
                                  {/* Password Input with strength meter */}
                                  <motion.div variants={formItemVariants}>
                                    <label className="block text-gray-300 text-sm font-pilot mb-2">Password</label>
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 pr-2 flex items-center pointer-events-none">
                                        <LockIcon className="h-5 w-5 text-gray-500" />
                                      </div>
                                      <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Create a strong password"
                                        className="w-full pl-10 pr-10 py-3 bg-dark text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
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
                                      <div className="text-red-500 font-pilot text-xs mt-1 ml-1">{errors.password}</div>
                                    )}

                                    {/* Password Requirements */}
                                    <div className="mb-6 p-4">
                                      <ul className="space-y-2 text-sm text-gray-500 font-pilot">
                                        <li className={`flex items-center ${values.password && values.password.length >= 8 ? 'text-green-400' : ''}`}>
                                          <CheckCircleIcon className="h-3 w-3 mr-2" />
                                          At least 8 characters long
                                        </li>
                                        <li className={`flex items-center ${values.password && /[A-Z]/.test(values.password) ? 'text-green-400' : ''}`}>
                                          <CheckCircleIcon className="h-3 w-3 mr-2" />
                                          Contains at least one uppercase letter
                                        </li>
                                        <li className={`flex items-center ${values.password && /[a-z]/.test(values.password) ? 'text-green-400' : ''}`}>
                                          <CheckCircleIcon className="h-3 w-3 mr-2" />
                                          Contains at least one lowercase letter
                                        </li>
                                        <li className={`flex items-center ${values.password && /\d/.test(values.password) ? 'text-green-400' : ''}`}>
                                          <CheckCircleIcon className="h-3 w-3 mr-2" />
                                          Contains at least one number
                                        </li>
                                      </ul>
                                    </div>
                                  </motion.div>

                                  {/* Confirm Password Input */}
                                  <motion.div variants={formItemVariants}>
                                    <label className="block text-gray-300 text-sm font-pilot mb-2">Confirm Password</label>
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
                                        className="w-full pl-10 pr-10 py-3 bg-dark text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
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
                                      <div className="text-red-500 text-xs mt-1 font-pilot ml-1">{errors.confirmPassword}</div>
                                    )}
                                    {!errors.confirmPassword && values.confirmPassword && values.password === values.confirmPassword && (
                                      <div className="text-green-500 text-xs mt-1 ml-1 flex items-center">
                                        <CheckCircleIcon className="h-3 w-3 mr-1" /> Passwords match
                                      </div>
                                    )}
                                  </motion.div>

                                  {/* Navigation buttons */}
                                  <motion.div variants={formItemVariants} className="grid grid-cols-2 gap-x-52 pt-4">
                                    <motion.button
                                      type="button"
                                      onClick={() => setSignupStep(2)}
                                      className="w-full bg-gray-800/80 text-gray-300 py-3.5 px-4 rounded-xl font-medium hover:bg-gray-700/90 transition-all duration-300 border border-gray-700/40 flex items-center justify-center shadow-md backdrop-blur-sm"
                                      whileHover={{ scale: 1.02, backgroundColor: "rgba(55, 65, 81, 0.9)" }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <ChevronLeftIcon className="h-5 w-5 mr-2 text-gray-400" />
                                      <span>Back</span>
                                    </motion.button>

                                    <motion.button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          !errors.password &&
                                          !errors.confirmPassword &&
                                          values.password &&
                                          values.confirmPassword &&
                                          values.password === values.confirmPassword
                                        ) {
                                          setSignupStep(4);
                                        }
                                      }}
                                      className={`w-full ${!errors.password &&
                                        !errors.confirmPassword &&
                                        values.password &&
                                        values.confirmPassword &&
                                        values.password === values.confirmPassword
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400'
                                        : 'bg-gray-700/80 text-gray-400 cursor-not-allowed'
                                        } text-white py-3.5 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center relative overflow-hidden group`}
                                    >
                                      <span>Continue</span>
                                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </motion.button>
                                  </motion.div>
                                </motion.div>
                              )}

                              {/* Step 4: Final Details */}
                              {signupStep === 4 && (
                                <motion.div
                                  key="step4"
                                  variants={stepVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="space-y-5"
                                >
                                  {/* Avatar Upload */}
                                  <motion.div variants={formItemVariants} className="text-center">
                                    <label className="block text-gray-300 text-sm font-pilot mb-4">Profile Picture (Optional)</label>
                                    <div className="flex justify-center">
                                      <div className="relative avatar-container">
                                        {values.avatar ? (
                                          <img
                                            src={URL.createObjectURL(values.avatar)}
                                            alt="Avatar preview"
                                            className="h-24 w-24 rounded-full object-cover border-2 border-orange-500"
                                          />
                                        ) : (
                                          <div className="h-24 w-24 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center">
                                            <UserIcon className="h-10 w-10 text-gray-500" />
                                          </div>
                                        )}
                                        <div className="avatar-overlay">
                                          <input
                                            type="file"
                                            id="avatar"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setFieldValue)}
                                            className="sr-only"
                                          />
                                          <label
                                            htmlFor="avatar"
                                            className="cursor-pointer text-white bg-orange-500/80 p-1 rounded-full"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-gray-400 font-pilot text-xs mt-2">
                                      Click to upload or change your profile picture
                                    </p>
                                  </motion.div>

                                  {/* Terms of Service */}
                                  <motion.div variants={formItemVariants} className="mt-4">
                                    <div className="p-4">
                                      <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                          <input
                                            id="terms"
                                            name="termsAccepted"
                                            type="checkbox"
                                            checked={values.termsAccepted}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-orange-500 border-gray-600 rounded bg-gray-700 focus:ring-orange-500"
                                          />
                                        </div>
                                        <div className="ml-3 text-sm">
                                          <label htmlFor="terms" className="text-gray-300 font-pilot">
                                            I agree to the <a href="#" className="text-orange-500 hover:text-orange-400 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-500 hover:text-orange-400 hover:underline">Privacy Policy</a>, and I confirm that I am at least 13 years old.
                                          </label>
                                        </div>
                                      </div>

                                      <div className="mt-4 flex items-start">
                                        <div className="flex items-center h-5">
                                          <input
                                            id="newsletter"
                                            name="newsletter"
                                            type="checkbox"
                                            className="h-5 w-5 text-orange-500 border-gray-600 rounded bg-gray-700 focus:ring-orange-500"
                                          />
                                        </div>
                                        <div className="ml-3 text-sm">
                                          <label htmlFor="newsletter" className="text-gray-300 font-pilot">
                                            Sign up to receive updates, promotions, and news about upcoming tournaments and events (optional)
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>

                                  {/* Security info */}
                                  <motion.div variants={formItemVariants} className="mt-2">
                                    <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-3 flex items-center">
                                      <ShieldCheckIcon className="h-6 w-6 mr-3 text-orange-500" />
                                      <div className="text-gray-400 text-xs font-pilot">
                                        Your information is secured with industry-standard encryption. We take your privacy seriously and will never share your data with third parties without your consent.
                                      </div>
                                    </div>
                                  </motion.div>

                                  {/* Navigation buttons */}
                                  <motion.div variants={formItemVariants} className="grid grid-cols-2 gap-x-52 pt-2">
                                    <motion.button
                                      type="button"
                                      onClick={() => setSignupStep(3)}
                                      className="w-full bg-gray-800 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 border border-gray-700/50 flex items-center justify-center"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                      </svg>
                                      Back
                                    </motion.button>

                                    <motion.button
                                      type="submit"
                                      className={`w-full bg-gradient-to-r ${values.termsAccepted
                                        ? 'from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400'
                                        : 'from-gray-700 to-gray-600 cursor-not-allowed'
                                        } text-white py-3 px-4 rounded-lg font-pilot transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center justify-center`}
                                      disabled={isLoading || !values.termsAccepted}
                                      whileHover={{ scale: isLoading || !values.termsAccepted ? 1 : 1.02 }}
                                      whileTap={{ scale: isLoading || !values.termsAccepted ? 1 : 0.98 }}
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
                                        <>
                                          <span>Create account</span>
                                          <CheckCircleIcon className="ml-2 h-5 w-5" />
                                        </>
                                      )}
                                    </motion.button>
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Form>
                        );
                      }}
                    </Formik>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
