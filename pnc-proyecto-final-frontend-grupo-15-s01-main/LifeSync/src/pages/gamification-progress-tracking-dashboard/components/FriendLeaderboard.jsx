import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function FriendLeaderboard({ onClose }) {
  const [timeframe, setTimeframe] = useState('week');

  // Mock leaderboard data
  const leaderboardData = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      points: 3250,
      level: 15,
      streak: 12,
      rank: 1,
      change: 0, // no change from last period
      badges: ['streak-master', 'goal-crusher']
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      points: 2890,
      level: 13,
      streak: 8,
      rank: 2,
      change: 1, // moved up 1 position
      badges: ['hydration-hero']
    },
    {
      id: 3,
      name: "You",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      points: 2450,
      level: 12,
      streak: 7,
      rank: 3,
      change: -1, // moved down 1 position
      badges: ['first-week', 'veggie-victory'],
      isCurrentUser: true
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      points: 2180,
      level: 11,
      streak: 5,
      rank: 4,
      change: 2, // moved up 2 positions
      badges: ['protein-power']
    },
    {
      id: 5,
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      points: 1950,
      level: 10,
      streak: 3,
      rank: 5,
      change: -1, // moved down 1 position
      badges: ['social-butterfly']
    }
  ];
  //En honor a Elias equipo Q.E.P.D este comentario sera escrito hoy y recordado por siempre 
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return { icon: 'Crown', color: 'text-yellow-500' };
      case 2:
        return { icon: 'Medal', color: 'text-gray-400' };
      case 3:
        return { icon: 'Award', color: 'text-orange-600' };
      default:
        return { icon: 'User', color: 'text-text-secondary' };
    }
  };

  const getChangeIndicator = (change) => {
    if (change > 0) {
      return { icon: 'TrendingUp', color: 'text-success', text: `+${change}` };
    } else if (change < 0) {
      return { icon: 'TrendingDown', color: 'text-error', text: `${change}` };
    }
    return { icon: 'Minus', color: 'text-text-secondary', text: '—' };
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Friend Leaderboard</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {['week', 'month', 'all'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-smooth capitalize ${timeframe === period
                      ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {leaderboardData.map((user, index) => {
          const rankInfo = getRankIcon(user.rank);
          const changeInfo = getChangeIndicator(user.change);

          return (
            <div
              key={user.id}
              className={`p-4 border-b border-border hover:bg-background transition-smooth ${user.isCurrentUser ? 'bg-primary bg-opacity-5 border-primary border-opacity-20' : ''
                }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex items-center space-x-2 w-12">
                  <Icon name={rankInfo.icon} size={20} className={rankInfo.color} />
                  <span className="font-bold text-text-primary">#{user.rank}</span>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 flex-1">
                  <div className="relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {user.isCurrentUser && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={8} color="white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${user.isCurrentUser ? 'text-primary' : 'text-text-primary'
                        }`}>
                        {user.name}
                      </span>
                      {user.isCurrentUser && (
                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-text-secondary">Level {user.level}</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Flame" size={12} className="text-orange-500" />
                        <span className="text-sm text-text-secondary">{user.streak}d</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Points & Change */}
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-text-primary">
                      {user.points.toLocaleString()}
                    </span>
                    <Icon name="Zap" size={14} className="text-warning" />
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Icon name={changeInfo.icon} size={12} className={changeInfo.color} />
                    <span className={`text-xs ${changeInfo.color}`}>
                      {changeInfo.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              {user.badges.length > 0 && (
                <div className="flex items-center space-x-2 mt-3 ml-16">
                  {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className="w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                      title={badge.replace('-', ' ')}
                    >
                      <Icon name="Award" size={12} color="white" />
                    </div>
                  ))}
                  {user.badges.length > 3 && (
                    <span className="text-xs text-text-secondary">
                      +{user.badges.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 text-primary hover:text-secondary transition-smooth">
            <Icon name="UserPlus" size={16} />
            <span className="text-sm font-medium">Invite Friends</span>
          </button>

          <button className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-smooth">
            <Icon name="Share2" size={16} />
            <span className="text-sm font-medium">Share Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendLeaderboard;