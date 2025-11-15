import React from 'react';
import Icon from 'components/AppIcon';

function PersonalRecords({ records }) {
  const getRecordIcon = (title) => {
    if (title.includes('Streak')) return 'Flame';
    if (title.includes('Points')) return 'Zap';
    if (title.includes('Perfect')) return 'Star';
    if (title.includes('Challenge')) return 'Trophy';
    return 'Award';
  };

  const getRecordColor = (title) => {
    if (title.includes('Streak')) return 'text-orange-500';
    if (title.includes('Points')) return 'text-yellow-500';
    if (title.includes('Perfect')) return 'text-purple-500';
    if (title.includes('Challenge')) return 'text-blue-500';
    return 'text-primary';
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Personal Records</h3>
        <button className="flex items-center space-x-2 text-primary hover:text-secondary transition-smooth">
          <Icon name="BarChart3" size={16} />
          <span className="text-sm font-medium">View All Stats</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-background rounded-lg p-4 border border-border hover:border-primary transition-smooth group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-border group-hover:border-primary transition-smooth">
                <Icon 
                  name={getRecordIcon(record.title)} 
                  size={24} 
                  className={getRecordColor(record.title)}
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary group-hover:text-primary transition-smooth">
                  {record.title}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-bold text-text-primary">
                    {record.value}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {record.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress indicator for ongoing records */}
            {record.title.includes('Streak') && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary">Current streak</span>
                  <span className="text-xs font-data text-text-primary">7 days</span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-500 ease-out"
                    style={{ width: '15.6%' }} // 7/45 * 100
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Milestones */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-md font-semibold text-text-primary mb-4">Next Milestones</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Flame" size={20} className="text-orange-500" />
              <div>
                <span className="font-medium text-text-primary">50-Day Streak</span>
                <div className="text-sm text-text-secondary">5 days to go</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-data text-text-primary">7/50</div>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-orange-500" style={{ width: '14%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Trophy" size={20} className="text-blue-500" />
              <div>
                <span className="font-medium text-text-primary">20 Challenges</span>
                <div className="text-sm text-text-secondary">5 more to unlock</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-data text-text-primary">15/20</div>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-blue-500" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Zap" size={20} className="text-yellow-500" />
              <div>
                <span className="font-medium text-text-primary">5,000 LifePoints</span>
                <div className="text-sm text-text-secondary">2,550 more needed</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-data text-text-primary">2,450/5,000</div>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-yellow-500" style={{ width: '49%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalRecords;