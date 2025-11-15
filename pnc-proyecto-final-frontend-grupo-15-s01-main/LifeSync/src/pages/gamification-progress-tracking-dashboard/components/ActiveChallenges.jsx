import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function ActiveChallenges({ challenges, onJoinChallenge }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const getChallengeTypeColor = (type) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500';
      case 'nutrition':
        return 'bg-green-500';
      case 'fitness':
        return 'bg-orange-500';
      default:
        return 'bg-primary';
    }
  };

  const getProgressColor = (progress, target) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Active Challenges</h2>
        <button className="flex items-center space-x-2 text-primary hover:text-secondary transition-smooth">
          <Icon name="Plus" size={18} />
          <span className="font-medium">Browse More</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {challenges.map((challenge) => {
          const progressPercentage = (challenge.progress / challenge.target) * 100;
          
          return (
            <div
              key={challenge.id}
              className="bg-surface rounded-lg shadow-soft border border-border p-6 hover:shadow-soft-hover transition-smooth cursor-pointer"
              onClick={() => setSelectedChallenge(challenge)}
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
                    className={`h-full ${getProgressColor(challenge.progress, challenge.target)} transition-all duration-500 ease-out`}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinChallenge(challenge.id);
                }}
                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-secondary transition-smooth"
              >
                Continue Challenge
              </button>
            </div>
          );
        })}
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-400 p-4">
          <div className="bg-surface rounded-lg shadow-soft-hover max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${selectedChallenge.color} rounded-lg flex items-center justify-center`}>
                  <Icon name={selectedChallenge.icon} size={24} color="white" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{selectedChallenge.title}</h3>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-text-secondary">{selectedChallenge.description}</p>
              
              <div className="bg-background rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-primary">{selectedChallenge.progress}</div>
                    <div className="text-sm text-text-secondary">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-primary">{selectedChallenge.target - selectedChallenge.progress}</div>
                    <div className="text-sm text-text-secondary">Remaining</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">{selectedChallenge.daysLeft} days left</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-warning">+{selectedChallenge.reward} LP reward</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-background transition-smooth"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onJoinChallenge(selectedChallenge.id);
                    setSelectedChallenge(null);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-smooth"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveChallenges;