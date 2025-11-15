import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function SocialFeed({ feed }) {
  const [likedPosts, setLikedPosts] = useState(new Set());

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getActionText = (item) => {
    switch (item.action) {
      case 'completed':
        return `completed the "${item.challenge}" challenge`;
      case 'achieved':
        return `earned the "${item.achievement}" achievement`;
      case 'joined':
        return `joined the "${item.challenge}" challenge`;
      default:
        return 'made progress';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'completed':
        return 'CheckCircle';
      case 'achieved':
        return 'Award';
      case 'joined':
        return 'UserPlus';
      default:
        return 'Activity';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'completed':
        return 'text-success';
      case 'achieved':
        return 'text-accent';
      case 'joined':
        return 'text-primary';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Community Feed</h3>
          <button className="text-primary hover:text-secondary transition-smooth">
            <Icon name="RefreshCw" size={18} />
          </button>
        </div>
      </div>

      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {feed.map((item) => (
          <div key={item.id} className="p-4 hover:bg-background transition-smooth">
            <div className="flex items-start space-x-3">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={item.avatar}
                  alt={item.user}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-text-primary">{item.user}</span>
                  <Icon 
                    name={getActionIcon(item.action)} 
                    size={14} 
                    className={getActionColor(item.action)}
                  />
                </div>
                
                <p className="text-sm text-text-secondary mb-2">
                  {getActionText(item)}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">{item.timestamp}</span>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center space-x-1 transition-smooth ${
                        likedPosts.has(item.id)
                          ? 'text-red-500' :'text-text-secondary hover:text-red-500'
                      }`}
                    >
                      <Icon 
                        name={likedPosts.has(item.id) ? 'Heart' : 'Heart'} 
                        size={14}
                        className={likedPosts.has(item.id) ? 'fill-current' : ''}
                      />
                      <span className="text-xs">
                        {item.likes + (likedPosts.has(item.id) ? 1 : 0)}
                      </span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-text-secondary hover:text-text-primary transition-smooth">
                      <Icon name="MessageCircle" size={14} />
                      <span className="text-xs">{item.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center justify-center space-x-2 py-2 text-primary hover:text-secondary transition-smooth">
          <Icon name="Users" size={16} />
          <span className="font-medium">View All Activity</span>
        </button>
      </div>
    </div>
  );
}

export default SocialFeed;