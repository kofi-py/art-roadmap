'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
    alert('You can still browse all content, but your progress will not be saved.');
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner animate-slideUp">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🍪</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              This site uses cookies
            </h3>
            <p className="text-gray-600">
              We use cookies to save your progress and enhance your experience. 
              You can still browse all courses without accepting cookies, but your progress won't be saved.
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="btn-primary"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
