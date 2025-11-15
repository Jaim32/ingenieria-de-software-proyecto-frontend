// src/components/ui/TimeDisplayCard.jsx
import React, { useState, useEffect } from 'react';

const TimeDisplayCard = () => {
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
    <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg mb-6">
      <p className="text-sm font-medium text-secondary mb-2 text-center">Current Time</p>
      <div className="font-mono text-4xl font-bold text-accent mb-2 tracking-wider text-center">
        {formatTime(currentTime)}
      </div>
      <p className="text-sm text-secondary text-center">
        {formatDate(currentTime)}
      </p>
    </div>
  );
};

export default TimeDisplayCard;
