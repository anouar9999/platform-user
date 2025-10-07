/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CheckCircle as CheckCircleIcon, X as CloseIcon } from 'lucide-react';
import Loader from '../login/Loader';

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', message: '' });

  // Define validation schema
  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const initialValues = {
    email: '',
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      // Example submission logic - replace with your actual API endpoint
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forgot_password.php`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (data.success) {
        setServerMessage({
          type: 'success',
          message: 'Password reset link has been sent to your email!',
        });
      } else {
        throw new Error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Error details:', error);
      setServerMessage({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Animation variants for form elements (staggered entrance)
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

  if (isLoading) {
    return (
      <Loader
        message={'Processing your request...'}
        username={''}
        logo="/images/logo-gamius-white.png"
        logoAlt="Gamius Logo"
      />
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-black font-circular-web"
      style={{
        backgroundImage:
          'url(https://lolstatic-a.akamaihd.net/rso-authenticator-ui/0.87.4/assets/riot_desktop_background_2x.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Server Message Display */}
      <AnimatePresence>
        {serverMessage.message && (
          <motion.div
            className={`mb-6 p-4 z-50 rounded-lg ${
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
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-secondary/80"></div>

      {/* Inject animated gradient CSS */}
      <style dangerouslySetInnerHTML={{ __html: animatedGradientStyle }} />

      {/* Logo positioned at the top */}
      <div className=" w-36 my-5 z-50 overflow-hidden">
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
          <Formik
            initialValues={initialValues}
            validationSchema={forgotPasswordSchema}
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
                    <h2 className="text-2xl font-zentry text-white">Forgot Password</h2>
                    <p className="text-gray-400 font-circular-web mt-2">
                      Enter your email to receive a password reset link
                    </p>
                  </motion.div>

                  {/* Email Input */}
                  <motion.div variants={formItemVariants}>
                    <label className="block text-white text-sm font-pilot mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-dark text-white font-pilot border border-gray-700 rounded-md focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    {touched.email && errors.email && (
                      <div className="text-red-500 font-pilot text-xs mt-1">{errors.email}</div>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={formItemVariants} className="mt-8">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 text-white py-3 font-zentry text-lg uppercase rounded-md
                        hover:bg-orange-600 transition-colors
                        disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={isLoading}
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
                          Processing...
                        </>
                      ) : (
                        'SEND RESET LINK'
                      )}
                    </button>
                  </motion.div>

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
