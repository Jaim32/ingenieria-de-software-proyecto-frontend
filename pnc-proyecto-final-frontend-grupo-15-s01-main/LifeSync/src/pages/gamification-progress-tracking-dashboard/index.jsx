import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

import LevelProgressHeader from './components/LevelProgressHeader';


function GamificationProgressTrackingDashboard() {
  const [celebrationAnimation, setCelebrationAnimation] = useState(null);

  // Mock user progress data
  const userProgress = {
    currentLevel: 12,
    lifePoints: 2450,
    nextLevelPoints: 3000,
    weeklyStreak: 7,
    totalAchievements: 23,
    completedChallenges: 15,
    rank: 3,
    weeklyGoalCompletion: 85
  };

  // Mock active challenges
  const activeChallenges = [
    {
      id: 1,
      title: "Hydration Hero",
      description: "Drink 8 glasses of water daily for 7 days",
      progress: 5,
      target: 7,
      reward: 150,
      type: "daily",
      icon: "Droplets",
      color: "bg-blue-500",
      daysLeft: 2,
      participants: 1247
    },
    {
      id: 2,
      title: "Protein Power Week",
      description: "Meet protein goals for 5 consecutive days",
      progress: 3,
      target: 5,
      reward: 200,
      type: "nutrition",
      icon: "Zap",
      color: "bg-orange-500",
      daysLeft: 4,
      participants: 892
    },
    {
      id: 3,
      title: "Veggie Victory",
      description: "Log 5 servings of vegetables daily",
      progress: 2,
      target: 7,
      reward: 100,
      type: "nutrition",
      icon: "Leaf",
      color: "bg-green-500",
      daysLeft: 5,
      participants: 2156
    }
  ];

  useEffect(() => {
    // Simulate achievement celebration
    const timer = setTimeout(() => {
      setCelebrationAnimation('levelUp');
      setTimeout(() => setCelebrationAnimation(null), 3000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleChallengeJoin = (challengeId) => {
    console.log(`Joining challenge: ${challengeId}`);
    // In real app, this would make an API call
  };



  return (
    <div className="theme-gamification min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Level Progress Header */}
        <LevelProgressHeader
          userProgress={userProgress}
        />

        {/* Main Content */}
        <div className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">Active Challenges</h2>
              <button className="flex items-center space-x-2 text-primary hover:text-secondary transition-smooth">
                <Icon name="Plus" size={18} />
                <span className="font-medium">Browse More</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeChallenges.map((challenge) => {
                const progressPercentage = (challenge.progress / challenge.target) * 100;

                return (
                  <div
                    key={challenge.id}
                    className="bg-surface rounded-lg shadow-soft border border-border p-6 hover:shadow-soft-hover transition-smooth cursor-pointer"
                  >
                    {/* Challenge Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${challenge.color} rounded-lg flex items-center justify-center`}>
                        <Icon name={challenge.icon} size={24} color="white" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} className="text-text-secondary" />
                          <span className="text-sm text-text-secondary">{challenge.daysLeft}d left</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Icon name="Users" size={14} className="text-text-secondary" />
                          <span className="text-sm text-text-secondary">{challenge.participants.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Challenge Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{challenge.title}</h3>
                      <p className="text-sm text-text-secondary">{challenge.description}</p>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-secondary">Progress</span>
                        <span className="text-sm font-data text-text-primary">
                          {challenge.progress}/{challenge.target}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${progressPercentage >= 80 ? 'bg-success' : progressPercentage >= 50 ? 'bg-warning' : 'bg-primary'} transition-all duration-500 ease-out`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-text-secondary">{Math.round(progressPercentage)}% complete</span>
                        <div className="flex items-center space-x-1">
                          <Icon name="Zap" size={12} className="text-warning" />
                          <span className="text-xs font-data text-warning">+{challenge.reward} LP</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleChallengeJoin(challenge.id)}
                      className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-secondary transition-smooth"
                    >
                      Continue Challenge
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* This Week Stats Card */}
        <div className="mt-8">
          <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} className="text-primary" />
                  <span className="text-sm text-text-secondary">Days Logged</span>
                </div>
                <span className="font-semibold text-text-primary">7/7</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Target" size={16} className="text-success" />
                  <span className="text-sm text-text-secondary">Goals Met</span>
                </div>
                <span className="font-semibold text-text-primary">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-warning" />
                  <span className="text-sm text-text-secondary">Points Earned</span>
                </div>
                <span className="font-semibold text-text-primary">1,250</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-accent" />
                  <span className="text-sm text-text-secondary">Rank</span>
                </div>
                <span className="font-semibold text-text-primary">#3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Celebration Animation */}
        {celebrationAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-500 pointer-events-none">
            <div className="text-center animate-bounce">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Trophy" size={48} color="white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Level Up!</h2>
              <p className="text-white opacity-90">You've reached Level 12</p>
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Icon name="Zap" size={20} className="text-yellow-400" />
                <span className="text-yellow-400 font-semibold">+500 LifePoints</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamificationProgressTrackingDashboard;