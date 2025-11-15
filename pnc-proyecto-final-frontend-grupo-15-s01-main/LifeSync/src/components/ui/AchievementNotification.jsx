import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

function AchievementNotification() {
  const [notifications, setNotifications] = useState([]);
  const [achievementHistory, setAchievementHistory] = useState([]);

  // Mock achievement data - in real app this would come from props or context
  const mockAchievements = [
    {
      id: 1,
      title: 'Streak Master',
      description: '7 days of consistent logging!',
      icon: 'Flame',
      type: 'streak',
      timestamp: Date.now() - 5000,
      xpReward: 100
    },
    {
      id: 2,
      title: 'Hydration Hero',
      description: 'Reached daily water goal',
      icon: 'Droplets',
      type: 'daily',
      timestamp: Date.now() - 10000,
      xpReward: 50
    }
  ];

  useEffect(() => {
    // Simulate real-time achievement detection
    const timer = setTimeout(() => {
      if (mockAchievements.length > 0) {
        const newAchievement = mockAchievements[0];
        showAchievement(newAchievement);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const showAchievement = (achievement) => {
    const notification = {
      ...achievement,
      id: Date.now(),
      isVisible: true
    };

    setNotifications(prev => [...prev, notification]);
    setAchievementHistory(prev => [achievement, ...prev]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(notification.id);
    }, 5000);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isVisible: false } : notif
      )
    );

    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300);
  };

  const getAchievementColor = (type) => {
    switch (type) {
      case 'streak':
        return 'bg-accent';
      case 'daily':
        return 'bg-primary';
      case 'milestone':
        return 'bg-secondary';
      default:
        return 'bg-success';
    }
  };

  const replayAchievement = (achievement) => {
    showAchievement({
      ...achievement,
      timestamp: Date.now()
    });
  };

  return (
    <>
      {/* Achievement Notifications */}
      <div className="fixed top-24 right-4 z-300 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`transform transition-all duration-400 ${
              notification.isVisible 
                ? 'translate-x-0 opacity-100 scale-100' :'translate-x-full opacity-0 scale-95'
            }`}
          >
            <div className="bg-surface rounded-lg shadow-soft-hover border border-border p-4 max-w-sm">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${getAchievementColor(notification.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon name={notification.icon} size={20} color="white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text-primary truncate">
                      {notification.title}
                    </h4>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="text-text-secondary hover:text-text-primary transition-smooth ml-2"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-text-secondary mt-1">
                    {notification.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="Zap" size={14} className="text-warning" />
                      <span className="text-xs font-data text-warning">
                        +{notification.xpReward} XP
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="Sparkles" size={14} className="text-accent animate-pulse" />
                      <span className="text-xs text-text-secondary">Achievement!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement History Indicator (in header area) */}
      {achievementHistory.length > 0 && (
        <div className="fixed top-4 right-20 z-300">
          <div className="relative">
            <button className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-soft hover:shadow-soft-hover transition-smooth">
              <Icon name="Award" size={16} color="white" />
            </button>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-semibold">
                {achievementHistory.length > 9 ? '9+' : achievementHistory.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Achievement History Modal (simplified for demo) */}
      {/* This would typically be a separate modal component */}
    </>
  );
}

export default AchievementNotification;