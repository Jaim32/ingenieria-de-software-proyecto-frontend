import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function RecentActivity() {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'meal_logged',
      title: 'Logged Breakfast',
      description: 'Oatmeal with berries and Greek yogurt',
      calories: 420,
      time: '2 hours ago',
      icon: 'Coffee',
      color: 'bg-accent'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'Completed 7-day logging streak!',
      xp: 100,
      time: '3 hours ago',
      icon: 'Trophy',
      color: 'bg-warning'
    },
    {
      id: 3,
      type: 'goal_reached',
      title: 'Water Goal Reached',
      description: 'Drank 8 glasses of water today',
      time: '4 hours ago',
      icon: 'Droplets',
      color: 'bg-primary'
    },
    {
      id: 4,
      type: 'meal_logged',
      title: 'Logged Lunch',
      description: 'Grilled chicken salad with quinoa',
      calories: 650,
      time: '5 hours ago',
      icon: 'Sun',
      color: 'bg-warning'
    },
    {
      id: 5,
      type: 'exercise',
      title: 'Exercise Logged',
      description: '30 minutes of cardio workout',
      caloriesBurned: 280,
      time: '6 hours ago',
      icon: 'Activity',
      color: 'bg-success'
    },
    {
      id: 6,
      type: 'meal_logged',
      title: 'Logged Snack',
      description: 'Apple and almonds',
      calories: 180,
      time: '8 hours ago',
      icon: 'Apple',
      color: 'bg-success'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Activity', count: activities.length },
    { id: 'meal_logged', label: 'Meals', count: activities.filter(a => a.type === 'meal_logged').length },
    { id: 'achievement', label: 'Achievements', count: activities.filter(a => a.type === 'achievement').length },
    { id: 'goal_reached', label: 'Goals', count: activities.filter(a => a.type === 'goal_reached').length }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case 'meal_logged':
        return activity.icon;
      case 'achievement':
        return 'Trophy';
      case 'goal_reached':
        return 'Target';
      case 'exercise':
        return 'Activity';
      default:
        return 'Bell';
    }
  };

  const getActivityValue = (activity) => {
    if (activity.calories) return `${activity.calories} cal`;
    if (activity.xp) return `+${activity.xp} XP`;
    if (activity.caloriesBurned) return `-${activity.caloriesBurned} cal`;
    return null;
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
        <Icon name="Activity" size={16} className="text-primary" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 mb-6 bg-background rounded-lg p-1">
        {filters.map((filterOption) => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
              filter === filterOption.id
                ? 'bg-surface text-primary shadow-soft'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{filterOption.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === filterOption.id
                ? 'bg-primary text-white' :'bg-border text-text-secondary'
            }`}>
              {filterOption.count}
            </span>
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:border-primary hover:bg-background transition-smooth group"
          >
            {/* Activity Icon */}
            <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-smooth`}>
              <Icon name={getActivityIcon(activity)} size={20} color="white" />
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-smooth">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-text-secondary mt-1">
                    {activity.description}
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0 ml-4">
                  {getActivityValue(activity) && (
                    <div className="text-sm font-data text-text-primary mb-1">
                      {getActivityValue(activity)}
                    </div>
                  )}
                  <div className="text-xs text-text-secondary">
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-border text-center">
        <button className="flex items-center justify-center space-x-2 text-sm text-primary hover:text-secondary transition-smooth mx-auto">
          <span>View All Activity</span>
          <Icon name="ArrowRight" size={14} />
        </button>
      </div>
    </div>
  );
}

export default RecentActivity;