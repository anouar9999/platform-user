'use client';
import React, { useState, useEffect } from 'react';

const CookiesModal = ({
  // Customizable props with defaults
  title = 'About Your Privacy',
  description = 'We process your data to deliver content or advertisements and measure the delivery of such content or advertisements to extract insights about our website. We share this information with our partners on the basis of consent and legitimate interest. You may exercise your right to consent or object to a legitimate interest, based on a specific purpose below or at a partner level in the link under each purpose. These choices will be signaled to our vendors.',
  acceptAllButtonText = 'Allow all',
  customizeButtonText = 'Manage Consent Preferences',
  submitChoicesText = 'Submit My Choices',
  rejectAllButtonText = 'Reject all',
  cookieOptions = [
    {
      id: 'necessary',
      name: 'Strictly Necessary Cookies',
      description:
        'These cookies are essential for the website to function properly and cannot be disabled.',
      isRequired: true,
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description:
        'These cookies enable personalized features and save your preferences for a better experience.',
      isRequired: false,
    },
    {
      id: 'performance',
      name: 'Performance Cookies',
      description:
        'These cookies help us understand how visitors interact with our website, helping us improve our site and services.',
      isRequired: false,
    },
    {
      id: 'marketing',
      name: 'Personalised ads and content measurement, audience insights and product development',
      description:
        'These cookies are used to deliver advertisements more relevant to you and your interests.',
      isRequired: false,
    },
  ],
  primaryColor = '#1a1a3a', // Dark blue/navy color from image
  onAccept = () => {},
  onReject = () => {},
  onSavePreferences = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cookieSelections, setCookieSelections] = useState({});
  const [expandedSection, setExpandedSection] = useState(null);
  const [isModalExpanded, setIsModalExpanded] = useState(false);

  // Initialize cookie selections based on required status
  useEffect(() => {
    const initialSelections = {};
    cookieOptions.forEach((option) => {
      initialSelections[option.id] = option.isRequired;
    });
    setCookieSelections(initialSelections);
  }, [cookieOptions]);

  // Check if consent has been given before
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setIsOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {};
    cookieOptions.forEach((option) => {
      allAccepted[option.id] = true;
    });

    // Save to localStorage
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));

    // Call the callback function
    onAccept(allAccepted);

    // Close modal
    setIsOpen(false);
  };

  const handleRejectAll = () => {
    const onlyRequired = {};
    cookieOptions.forEach((option) => {
      onlyRequired[option.id] = option.isRequired;
    });

    // Save to localStorage
    localStorage.setItem('cookieConsent', 'minimal');
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyRequired));

    // Call the callback function
    onReject(onlyRequired);

    // Close modal
    setIsOpen(false);
  };

  const handleToggleCookie = (id) => {
    if (cookieOptions.find((option) => option.id === id)?.isRequired) {
      return; // Can't toggle required cookies
    }

    setCookieSelections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSavePreferences = () => {
    // Save to localStorage
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(cookieSelections));

    // Call the callback function
    onSavePreferences(cookieSelections);

    // Close modal
    setIsOpen(false);
  };

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const expandModal = () => {
    setIsModalExpanded(true);
  };

  // To manually open the modal again
  const openModal = () => {
    setIsOpen(true);
    setIsModalExpanded(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div
        className="bg-secondary angular-cut shadow-lg w-full max-w-2xl overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isModalExpanded ? '90vh' : '80vh',
        }}
      >
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: isModalExpanded ? 'calc(90vh - 40px)' : '350px' }}
        >
          {/* Header */}
          <h2 className="text-2xl font-ea-football text-primary mb-3">{title}</h2>
          <p className="text-white text-sm mb-6">{description}</p>

          {!isModalExpanded ? (
            // Initial view with just two buttons
            <div className="flex flex-col gap-3">
              <button
                className="w-full py-2.5 px-4 rounded-md text-white font-ea-football bg-primary"
                onClick={handleAcceptAll}
              >
                {acceptAllButtonText}
              </button>
              <button
                className="w-full py-2.5 px-4 rounded-md font-ea-football border border-gray-300 text-primary"
                onClick={expandModal}
              >
                {customizeButtonText}
              </button>
            </div>
          ) : (
            // Expanded view with cookie options
            <>
              <div className="space-y-2 mb-6">
                {cookieOptions.map((option) => (
                  <div key={option.id} className="border border-primary rounded-md overflow-hidden">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer"
                      onClick={() => toggleSection(option.id)}
                    >
                      <div className="flex items-center">
                        <span className="text-xl text-white mr-2">
                          {expandedSection === option.id ? '−' : '+'}
                        </span>
                        <span className="font-medium text-white">{option.name}</span>
                      </div>

                      <div className="flex items-center">
                        {option.isRequired && (
                          <span className="text-gray-400 text-sm mr-3">Always Active</span>
                        )}
                        <div
                          className={`w-10 h-5 relative ${
                            option.isRequired ? 'pointer-events-none' : 'cursor-pointer'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!option.isRequired) handleToggleCookie(option.id);
                          }}
                        >
                          <div
                            className={`absolute inset-0 rounded-full transition-colors ${
                              cookieSelections[option.id] ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          ></div>
                          <div
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                              cookieSelections[option.id] ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {expandedSection === option.id && (
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div className="flex justify-between gap-3">
                <button
                  className="py-2.5 px-5 rounded-md text-white text-sm font-medium border border-primary"
                  onClick={handleRejectAll}
                >
                  {rejectAllButtonText}
                </button>
                <button
                  className="py-2.5 px-5 rounded-md text-white text-sm font-ea-football bg-primary angular-cut"
                  onClick={handleSavePreferences}
                >
                  {submitChoicesText}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookiesModal;
