import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function ProgressHeatmap() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock heatmap data - represents daily goal completion rates
  const generateHeatmapData = () => {
    const data = [];
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      data.push({
        date: date.toISOString().split('T')[0],
        completion: Math.floor(Math.random() * 101), // 0-100%
        goals: Math.floor(Math.random() * 5) + 1, // 1-5 goals
        streak: i > 0 && data[i-1]?.completion > 70 ? (data[i-1]?.streak || 0) + 1 : 0
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (completion) => {
    if (completion >= 90) return 'bg-green-600';
    if (completion >= 70) return 'bg-green-500';
    if (completion >= 50) return 'bg-green-400';
    if (completion >= 30) return 'bg-green-300';
    if (completion > 0) return 'bg-green-200';
    return 'bg-gray-200';
  };

  const getIntensityLabel = (completion) => {
    if (completion >= 90) return 'Excellent';
    if (completion >= 70) return 'Good';
    if (completion >= 50) return 'Fair';
    if (completion >= 30) return 'Poor';
    if (completion > 0) return 'Minimal';
    return 'No activity';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Progress Heatmap</h3>
        <div className="flex items-center space-x-2">
          {['week', 'month', 'quarter'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-smooth capitalize ${
                selectedPeriod === period
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-4">
        {selectedPeriod === 'week' ? (
          // Week view - single row
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2">
              {heatmapData.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-text-secondary mb-1">
                    {getDayName(day.date)}
                  </div>
                  <div
                    className={`w-full h-8 rounded ${getIntensityColor(day.completion)} cursor-pointer transition-smooth hover:scale-110 flex items-center justify-center`}
                    title={`${formatDate(day.date)}: ${day.completion}% completion`}
                  >
                    <span className="text-xs font-medium text-white">
                      {day.completion}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Month/Quarter view - grid layout
          <div className="space-y-2">
            <div className={`grid gap-1 ${
              selectedPeriod === 'month' ? 'grid-cols-10' : 'grid-cols-13'
            }`}>
              {heatmapData.map((day, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded ${getIntensityColor(day.completion)} cursor-pointer transition-smooth hover:scale-125`}
                  title={`${formatDate(day.date)}: ${day.completion}% completion - ${getIntensityLabel(day.completion)}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Less</span>
            <div className="flex items-center space-x-1">
              {[0, 30, 50, 70, 90].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded ${getIntensityColor(level)}`}
                />
              ))}
            </div>
            <span className="text-sm text-text-secondary">More</span>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Icon name="Target" size={14} className="text-success" />
              <span className="text-text-secondary">
                Avg: {Math.round(heatmapData.reduce((sum, day) => sum + day.completion, 0) / heatmapData.length)}%
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Flame" size={14} className="text-orange-500" />
              <span className="text-text-secondary">
                Best: {Math.max(...heatmapData.map(day => day.streak))} days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary">
            {heatmapData.filter(day => day.completion >= 70).length}
          </div>
          <div className="text-sm text-text-secondary">Good Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary">
            {heatmapData.filter(day => day.completion === 100).length}
          </div>
          <div className="text-sm text-text-secondary">Perfect Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary">
            {Math.round(heatmapData.reduce((sum, day) => sum + day.goals, 0) / heatmapData.length)}
          </div>
          <div className="text-sm text-text-secondary">Avg Goals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary">
            {Math.max(...heatmapData.map(day => day.streak))}
          </div>
          <div className="text-sm text-text-secondary">Best Streak</div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeatmap;