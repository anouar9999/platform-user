/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CheckCircle as CheckCircleIcon, X as CloseIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '../login/Loader';

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
    }
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Password strength validation
  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    setPasswordStrength({
      score,
      requirements
    });
  };

  // Define validation schema
  const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, 
        'Password must contain at least one uppercase letter, one lowercase letter, and one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setServerMessage({
          type: 'error',
          message: 'Invalid reset link. Please request a new password reset.',
        });
        setIsValidatingToken(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reset_password.php?token=${token}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setTokenData(data.data);
        } else {
          setServerMessage({
            type: 'error',
            message: data.message || 'Invalid or expired reset token.',
          });
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setServerMessage({
          type: 'error',
          message: 'Failed to validate reset token. Please try again.',
        });
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setServerMessage({ type: '', message: '' });
    
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reset_password.php`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: values.password,
          confirm_password: values.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setServerMessage({
          type: 'success',
          message: data.message,
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setServerMessage({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const formItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  // Show loading while validating token
  if (isValidatingToken) {
    return (
      <Loader
        message={'Validating reset link...'}
        username={''}
        logo="images/logo-gamius-white.png"
        logoAlt="Gamius Logo"
      />
    );
  }

  // Show loading while processing
  if (isLoading) {
    return (
      <Loader
        message={'Resetting your password...'}
        username={''}
        logo="images/logo-gamius-white.png"
        logoAlt="Gamius Logo"
      />
    );
  }

  // If token is invalid, show error state
  if (!tokenData && serverMessage.type === 'error') {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center bg-black"
        style={{
          backgroundImage:
            'url(https://lolstatic-a.akamaihd.net/rso-authenticator-ui/0.87.4/assets/riot_desktop_background_2x.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-secondary/80"></div>

        <div className="w-36 z-50 overflow-hidden mb-8">
          <img
            src="images/logo-gamius-white.png"
            alt="Gamius Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div
          className="relative w-full max-w-md mx-auto bg-secondary shadow-2xl overflow-hidden z-10 border border-gray-800/50"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-ea-football text-white mb-4">Invalid Reset Link</h2>
            <p className="text-gray-400 font-pilot mb-6">{serverMessage.message}</p>
            <div className="space-y-4">
              <a
                href="/forgot-password"
                className="block w-full bg-orange-500 text-white py-3 font-pilot uppercase rounded-md hover:bg-orange-600 transition-colors"
              >
                Request New Reset Link
              </a>
              <a
                href="/login"
                className="block text-gray-400 font-pilot hover:text-orange-500 transition-colors"
              >
                Back to Login
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-black"
      style={{
        backgroundImage:
          'url(https://lolstatic-a.akamaihd.net/rso-authenticator-ui/0.87.4/assets/riot_desktop_background_2x.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-secondary/80"></div>

      {/* Logo positioned at the top */}
      <div className="w-36 z-50 overflow-hidden">
        <img
          src="/images/logo-gamius-white.png"
          alt="Gamius Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Auth modal - centered with fixed width */}
      <motion.div
        className="relative w-full max-w-md mx-auto bg-secondary shadow-2xl overflow-hidden z-10 border border-gray-800/50"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="p-8">
          {/* Server Message Display */}
          <AnimatePresence>
            {serverMessage.message && (
              <motion.div
                className={`mb-6 p-4 rounded-lg ${
                  serverMessage.type === 'error'
                    ? 'bg-red-900/40 text-red-200 border border-red-700/50'
                    : 'bg-green-900/40 text-green-200 border border-green-700/50'
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

          <Formik
            initialValues={initialValues}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <motion.div
                  className="space-y-6"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Title */}
                  <motion.div variants={formItemVariants} className="text-center mb-8">
                    <h2 className="text-2xl font-ea-football text-white">Reset Password</h2>
                    <p className="text-gray-400 font-pilot mt-2">
                      Enter your new password for <strong>{tokenData?.username}</strong>
                    </p>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div variants={formItemVariants}>
                    <label className="block text-white text-sm font-pilot mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={values.password}
                        onChange={(e) => {
                          handleChange(e);
                          checkPasswordStrength(e.target.value);
                        }}
                        onBlur={handleBlur}
                        placeholder="Enter your new password"
                        className="w-full px-4 py-3 pr-12 bg-dark text-white font-pilot border border-gray-700 rounded-md focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {values.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-2">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded ${
                                i < passwordStrength.score
                                  ? passwordStrength.score <= 2
                                    ? 'bg-red-500'
                                    : passwordStrength.score === 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div className={`flex items-center ${passwordStrength.requirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                            <span className="mr-2">{passwordStrength.requirements.length ? '✓' : '○'}</span>
                            At least 6 characters
                          </div>
                          <div className={`flex items-center ${passwordStrength.requirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                            <span className="mr-2">{passwordStrength.requirements.uppercase ? '✓' : '○'}</span>
                            One uppercase letter
                          </div>
                          <div className={`flex items-center ${passwordStrength.requirements.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                            <span className="mr-2">{passwordStrength.requirements.lowercase ? '✓' : '○'}</span>
                            One lowercase letter
                          </div>
                          <div className={`flex items-center ${passwordStrength.requirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                            <span className="mr-2">{passwordStrength.requirements.number ? '✓' : '○'}</span>
                            One number
                          </div>
                        </div>
                      </div>
                    )}

                    {touched.password && errors.password && (
                      <div className="text-red-500 font-pilot text-xs mt-1">{errors.password}</div>
                    )}
                  </motion.div>

                  {/* Confirm Password Input */}
                  <motion.div variants={formItemVariants}>
                    <label className="block text-white text-sm font-pilot mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm your new password"
                        className="w-full px-4 py-3 pr-12 bg-dark text-white font-pilot border border-gray-700 rounded-md focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="text-red-500 font-pilot text-xs mt-1">{errors.confirmPassword}</div>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={formItemVariants} className="mt-8">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 text-white py-3 font-pilot uppercase rounded-md
                        hover:bg-orange-600 transition-colors
                        disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={isLoading || passwordStrength.score < 4}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Resetting Password...
                        </>
                      ) : (
                        'RESET PASSWORD'
                      )}
                    </button>
                  </motion.div>

                  {/* Success Message with Auto-redirect */}
                  {serverMessage.type === 'success' && (
                    <motion.div 
                      variants={formItemVariants} 
                      className="text-center mt-6 p-4 bg-green-900/40 text-green-200 border border-green-700/50 rounded-lg"
                    >
                      <CheckCircleIcon className="h-6 w-6 mx-auto mb-2 text-green-400" />
                      <p className="font-pilot text-sm mb-2">Password reset successful!</p>
                      <p className="font-pilot text-xs text-green-300">
                        Redirecting to login page in 3 seconds...
                      </p>
                    </motion.div>
                  )}

                  {/* Back to Login Link */}
                  <motion.div variants={formItemVariants} className="text-center mt-6">
                    <a
                      href="/login"
                      className="text-gray-400 font-pilot hover:text-orange-500 transition-colors"
                    >
                      Back to Login
                    </a>
                  </motion.div>
                </motion.div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
}