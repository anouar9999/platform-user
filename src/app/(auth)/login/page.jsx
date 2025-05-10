'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  ImageIcon,
  FileTextIcon,
  Mail,
  User,
} from 'lucide-react';
import FloatingLabelInput from '@/app/components/input/FloatingInput';
import ServerMessage from './ServerMessage';
import FloatingLabelTextArea from '@/app/components/FloatingTextArea';
import Loader from './Loader';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userData, setUserData] = useState(null);
  
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });
  
  const registerSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Too short')
      .max(50, 'Too long')
      .matches(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'Min 8 characters')
      .matches(/[a-z]/, '1 lowercase')
      .matches(/[A-Z]/, '1 uppercase')
      .matches(/[0-9]/, '1 number')
      .matches(/[^a-zA-Z0-9]/, '1 special character')
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
    avatar: Yup.mixed(), // Changed from URL to mixed for file upload
    bio: Yup.string().max(500, 'Too long'),
  });

  const initialValues = isLogin
    ? { email: '', password: '' }
    : {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        bio: '',
        is_verified: 1,
      };

  const inputClasses = ` w-full 
            bg-dark
            text-white 
            rounded-xl 
            text-sm 
            text-[10pt] 
            px-6 
            py-3 
            
            focus:outline-none 
            focus:ring-2 
            focus:ring-black/20 
            peer
        
            pr-12`;

  const inputWithIconClasses = `${inputClasses}`;

  // Handle file change for avatar upload
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

  // Updated handleSubmit function
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);

    try {
      const url = isLogin
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_login.php`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user_register.php`;

      let response;

      if (isLogin) {
        // Login request handling
        const loginData = {
          email: values.email,
          password: values.password,
        };

        console.log('Sending login data:', loginData);

        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        const responseText = await response.text();
        console.log('Raw login response:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse login response:', e);
          throw new Error('Invalid server response format');
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Login failed');
        }

        // Store user session data and save in state
        setUserData({
          username: data.username,
          avatarUrl: data.avatar,
          userId: data.user_id
        });

        // Store user session data in localStorage
        localStorage.setItem('userSessionToken', data.session_token);
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userType', data.user_type);
        localStorage.setItem('avatarUrl', data.avatar);

        setServerMessage({
          type: 'success',
          message: `Welcome back, ${data.username}! Redirecting to dashboard...`,
        });

        setTimeout(() => {
          router.push('/tournaments');
        }, 1500);
      } else {
        // Registration request handling
        const formData = new FormData();

        // Basic user data
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('bio', values.bio || '');
        formData.append('is_verified', '1');

        // Handle avatar file
        if (values.avatar && values.avatar instanceof File) {
          formData.append('avatar', values.avatar, values.avatar.name);
        }

        console.log('Sending registration data:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
        }

        response = await fetch(url, {
          method: 'POST',
          body: formData,
        });

        const responseText = await response.text();
        console.log('Raw registration response:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse registration response:', e);
          throw new Error('Invalid server response format');
        }

        if (!response.ok) {
          console.error('Server error details:', data);
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        if (data.success) {
          setServerMessage({
            type: 'success',
            message: 'Account created successfully! You can now log in.',
          });

          setTimeout(() => {
            setIsLogin(true);
            setIsLoading(false);
          }, 2000);
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Error details:', error);
      setServerMessage({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.',
      });
      setIsLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  // If loading with successful login/registration, show the YouTube style loader
  if (isLoading && serverMessage.type === 'success') {
    return (
      <Loader 
        message={serverMessage.message}
        username={userData?.username}
        logo="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg"
        logoAlt="MGE 2025 Logo"
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-1.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-secondary/80 to-transparent"></div>
        <div
          className={`absolute inset-0 bg-gradient-to-l from-secondary/95 via-secondary to-transparent`}
        ></div>
      </div>

      {/* Left side content - hidden on mobile */}
      <div
        className={`relative z-10 w-full md:${
          isLogin ? 'w-1/2' : 'w-1/3'
        } p-12 hidden md:flex flex-col justify-center`}
      >
        <div className="space-y-4 max-w-xl">
          <div className="mb-6 w-56">
            <Image
              src="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg"
              alt="MGE 2025"
              width={220}
              height={40}
              className="w-full h-auto"
            />
          </div>

          <h1 className="font-custom tracking-widest text-5xl font-bold text-white leading-tight">
            Unleash Your Competitive Spirit at <br />
            <span className="text-primary">MGE 2025!</span>
            <br />
          </h1>

          <p className="text-gray-300 text-sm max-w-md">
            Join the ultimate esports event in Morocco. Battle top contenders and write your name
            in gaming history.{' '}
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div
        className={`relative z-10 w-full md:${
          isLogin ? 'w-1/2' : 'w-2/3'
        } min-h-screen flex flex-col items-center justify-center px-6 py-8`}
      >
        {/* Logo container - centered on mobile */}
        <div className="md:hidden w-48 mb-12">
          <Image
            src="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg"
            alt="MGE 2025"
            width={220}
            height={40}
            className="w-full h-auto"
          />
        </div>

        <div className={isLogin ? 'max-w-md w-full' : ' w-full max-w-2xl'}>
          <div className="space-y-3 mb-8 text-center md:text-left">
            {isLogin ? (
              <h2 className="text-xl sm:text-4xl md:text-5xl tracking-wider text-white font-custom leading-tight">
                Log in <span className="text-primary">.</span> <br />
                welcome back
              </h2>
            ) : (
              <h2 className="text-xl sm:text-4xl md:text-5xl tracking-wider text-white font-custom leading-tight">
                Sign up <span className="text-primary">.</span> And
                <br />
                Join us now
              </h2>
            )}
            <p className="text-gray-500 text-sm sm:text-sm w-full">
              Connect now… and remember: your well-being is the key to success.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values, handleChange, handleBlur }) => (
              <Form className={isLogin ? 'space-y-10' : 'space-y-7'}>
                {serverMessage.type !== 'success' && (
                  <ServerMessage
                    type={serverMessage.type}
                    message={serverMessage.message}
                    onClose={() => setServerMessage({ type: '', message: '' })}
                  />
                )}

                {/* Login Form - Stays the same */}
                {isLogin && (
                  <>
                    <FloatingLabelInput
                      label="Email"
                      type="email"
                      icon={MailIcon}
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                      placeholder="Enter your email"
                    />

                    <FloatingLabelInput
                      label="Password"
                      type="password"
                      icon={LockIcon}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && errors.password}
                      placeholder="Enter your password"
                    />
                  </>
                )}

                {/* Registration Form - With Grid */}
                {!isLogin && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Upload Section */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar Preview */}
                        {avatarPreview && (
                          <div className="shrink-0">
                            <Image
                              src={avatarPreview}
                              alt="Avatar preview"
                              width={60}
                              height={60}
                              className="rounded-full object-cover ring-2 ring-gray-700/50"
                            />
                          </div>
                        )}

                        {/* File Input */}
                        <div className="relative flex-grow w-full">
                          <label className="absolute transition-all text-[12pt] font-custom leading-tight tracking-widest duration-200 pointer-events-none -translate-y-9 top-5 left-4 text-xs rounded-md text-gray-400 bg-dark px-2">
                            Profile Picture
                          </label>
                          <input
                            type="file"
                            name="avatar"
                            onChange={(event) => handleFileChange(event, setFieldValue)}
                            accept="image/jpeg,image/png,image/gif"
                            className={`${inputWithIconClasses} file:mr-4 file:py-2 file:px-4      

          file:rounded-full file:border-0 file:text-sm file:bg-secondary 
          file:text-gray-300 hover:file:bg-gray-600 cursor-pointer`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6 lg:space-y-0">
                      <FloatingLabelInput
                        label="Username"
                        type="text"
                        icon={UserIcon}
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.username && errors.username}
                        placeholder="Choose a username"
                        classNames={'mb-8'}
                      />
                      <FloatingLabelInput
                        label="Password"
                        type="password"
                        icon={LockIcon}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && errors.password}
                        placeholder="Create a strong password"
                      />
                    </div>

                    <div className="space-y-6 lg:space-y-0">
                      <FloatingLabelInput
                        label="Email"
                        type="email"
                        icon={MailIcon}
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && errors.email}
                        placeholder="Enter your email"
                        classNames={'mb-8'}
                      />

                      <FloatingLabelInput
                        label="Confirm Password"
                        type="password"
                        icon={LockIcon}
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.confirmPassword && errors.confirmPassword}
                        placeholder="Confirm your password"
                      />
                    </div>

                    {/* Bio Section */}
                    <div className="lg:col-span-2">
                      <FloatingLabelTextArea
                        label="Bio"
                        type="textarea"
                        icon={FileTextIcon}
                        name="bio"
                        row={2}
                        value={values.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.bio && errors.bio}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                )}

                {/* Button and account toggle remain the same for both forms */}
                <motion.button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-3xl font-medium
                    hover:bg-primary/20 focus:ring-2 focus:ring-primary/20 
                    transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
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
                    isLogin ? 'Sign in' : 'Create account'
                  )}
                </motion.button>

                <p className="mt-8 text-center text-gray-400 max-w-lg mx-auto w-full">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setServerError('');
                      setServerMessage({ type: '', message: '' });
                    }}
                    className="ml-2 text-primary hover:underline font-medium transition-colors"
                  >
                    {isLogin ? 'Create an account' : 'Sign in'}
                  </button>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}