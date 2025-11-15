import React, { useState, useEffect } from 'react';

const TimeDisplayHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-surface/50 backdrop-blur-sm border-b border-border px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">SleepCycle</h1>
              <p className="text-xs text-text-secondary">Optimize Your Rest</p>
            </div>
          </div>
        </div>

        {/* Current Time Display */}
        <div className="text-center">
          <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
            <p className="text-sm font-medium text-text-secondary mb-2">Current Time</p>
            <div className="font-mono text-4xl font-bold text-accent mb-2 tracking-wider">
              {formatTime(currentTime)}
            </div>
            <p className="text-sm text-text-secondary">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TimeDisplayHeader;