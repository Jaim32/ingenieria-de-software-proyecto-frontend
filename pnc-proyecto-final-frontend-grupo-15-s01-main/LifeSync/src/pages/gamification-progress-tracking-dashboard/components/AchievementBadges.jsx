import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function AchievementBadges({ achievements, onShareAchievement }) {
  const [filter, setFilter] = useState('all');

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500';
      case 'rare':
        return 'bg-blue-500';
      case 'epic':
        return 'bg-purple-500';
      case 'legendary':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300';
      case 'rare':
        return 'border-blue-300';
      case 'epic':
        return 'border-purple-300';
      case 'legendary':
        return 'border-yellow-300';
      default:
        return 'border-gray-300';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'earned') return achievement.earned;
    if (filter === 'progress') return !achievement.earned;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Achievement Collection</h2>
        <div className="flex items-center space-x-2">
          {['all', 'earned', 'progress'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-smooth capitalize ${
                filter === filterType
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-surface rounded-lg shadow-soft border-2 p-6 transition-smooth hover:shadow-soft-hover ${
              achievement.earned 
                ? `${getRarityBorder(achievement.rarity)} hover:scale-105` 
                : 'border-gray-200 opacity-60'
            }`}
          >
            {/* Badge Icon */}
            <div className="text-center mb-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                achievement.earned 
                  ? getRarityColor(achievement.rarity)
                  : 'bg-gray-300'
              }`}>
                <Icon 
                  name={achievement.icon} 
                  size={32} 
                  color="white" 
                  className={achievement.earned ? '' : 'opacity-50'}
                />
              </div>
              
              {/* Rarity Indicator */}
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                achievement.earned
                  ? `${getRarityColor(achievement.rarity)} text-white`
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {achievement.rarity}
              </div>
            </div>

            {/* Achievement Info */}
            <div className="text-center mb-4">
              <h3 className={`text-lg font-semibold mb-2 ${
                achievement.earned ? 'text-text-primary' : 'text-text-secondary'
              }`}>
                {achievement.title}
              </h3>
              <p className={`text-sm ${
                achievement.earned ? 'text-text-secondary' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>
            </div>

            {/* Progress or Date */}
            {achievement.earned ? (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-success mb-2">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm font-medium">Earned</span>
                </div>
                <p className="text-xs text-text-secondary">{achievement.earnedDate}</p>
              </div>
            ) : (
              achievement.progress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Progress</span>
                    <span className="text-xs font-data text-text-primary">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                </div>
              )
            )}

            {/* Action Button */}
            {achievement.earned && (
              <button
                onClick={() => onShareAchievement(achievement.id)}
                className="w-full mt-4 flex items-center justify-center space-x-2 py-2 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-smooth"
              >
                <Icon name="Share2" size={16} />
                <span className="text-sm font-medium">Share</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Award" size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-text-secondary mb-2">No achievements found</h3>
          <p className="text-text-secondary">
            {filter === 'earned' ?'Complete challenges to earn your first achievement!'
              : filter === 'progress' ?'All achievements completed! Check back for new ones.' :'Start your journey to unlock achievements!'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default AchievementBadges;