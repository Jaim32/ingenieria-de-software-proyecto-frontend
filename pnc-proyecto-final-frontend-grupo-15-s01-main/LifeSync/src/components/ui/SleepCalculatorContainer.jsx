import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const SleepCalculatorContainer = () => {
  const [activeMode, setActiveMode] = useState('wake-up');
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [bedTime, setBedTime] = useState('');
  const [sleepDuration, setSleepDuration] = useState('8');
  const [calculatedTimes, setCalculatedTimes] = useState([]);

  // Sleep cycle duration in minutes (90 minutes)
  const SLEEP_CYCLE_DURATION = 90;
  const FALL_ASLEEP_TIME = 15; // Average time to fall asleep

  const calculateSleepTimes = () => {
    if (activeMode === 'wake-up' && wakeUpTime) {
      const [hours, minutes] = wakeUpTime.split(':').map(Number);
      const wakeUpDate = new Date();
      wakeUpDate.setHours(hours, minutes, 0, 0);

      const times = [];
      // Calculate 4-6 sleep cycles (6-9 hours of sleep)
      for (let cycles = 4; cycles <= 6; cycles++) {
        const totalSleepMinutes = cycles * SLEEP_CYCLE_DURATION;
        const bedTimeDate = new Date(wakeUpDate.getTime() - (totalSleepMinutes + FALL_ASLEEP_TIME) * 60000);
        
        times.push({
          cycles,
          bedTime: bedTimeDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          sleepHours: Math.floor(totalSleepMinutes / 60),
          sleepMinutes: totalSleepMinutes % 60,
          quality: cycles === 5 ? 'optimal' : cycles === 6 ? 'good' : 'minimum'
        });
      }
      setCalculatedTimes(times);
    } else if (activeMode === 'bedtime' && bedTime) {
      const [hours, minutes] = bedTime.split(':').map(Number);
      const bedTimeDate = new Date();
      bedTimeDate.setHours(hours, minutes, 0, 0);

      const times = [];
      // Calculate wake up times for 4-6 sleep cycles
      for (let cycles = 4; cycles <= 6; cycles++) {
        const totalSleepMinutes = cycles * SLEEP_CYCLE_DURATION;
        const wakeUpDate = new Date(bedTimeDate.getTime() + (totalSleepMinutes + FALL_ASLEEP_TIME) * 60000);
        
        times.push({
          cycles,
          wakeUpTime: wakeUpDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          sleepHours: Math.floor(totalSleepMinutes / 60),
          sleepMinutes: totalSleepMinutes % 60,
          quality: cycles === 5 ? 'optimal' : cycles === 6 ? 'good' : 'minimum'
        });
      }
      setCalculatedTimes(times);
    }
  };

  useEffect(() => {
    calculateSleepTimes();
  }, [activeMode, wakeUpTime, bedTime]);

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'optimal': return 'text-success border-success/20 bg-success/5';
      case 'good': return 'text-primary border-primary/20 bg-primary/5';
      case 'minimum': return 'text-warning border-warning/20 bg-warning/5';
      default: return 'text-text-secondary border-border bg-surface/50';
    }
  };

  const getQualityIcon = (quality) => {
    switch (quality) {
      case 'optimal': return 'Star';
      case 'good': return 'CheckCircle';
      case 'minimum': return 'Clock';
      default: return 'Circle';
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      {/* Mode Toggle */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-1 mb-6 border border-border">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveMode('wake-up')}
            className={`
              py-3 px-4 rounded-xl font-medium text-sm transition-smooth
              ${activeMode === 'wake-up' ?'bg-primary text-white shadow-md' :'text-text-secondary hover:text-text-primary hover:bg-surface/50'
              }
            `}
          >
            <Icon name="Sun" size={16} className="inline mr-2" />
            Wake Up Time
          </button>
          <button
            onClick={() => setActiveMode('bedtime')}
            className={`
              py-3 px-4 rounded-xl font-medium text-sm transition-smooth
              ${activeMode === 'bedtime' ?'bg-primary text-white shadow-md' :'text-text-secondary hover:text-text-primary hover:bg-surface/50'
              }
            `}
          >
            <Icon name="Moon" size={16} className="inline mr-2" />
            Bedtime
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-border shadow-lg">
        <div className="space-y-4">
          {activeMode === 'wake-up' ? (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                What time do you want to wake up?
              </label>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="
                  w-full px-4 py-3 bg-background border border-border rounded-xl
                  text-text-primary font-mono text-lg
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                  transition-smooth
                "
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                What time are you going to bed?
              </label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="
                  w-full px-4 py-3 bg-background border border-border rounded-xl
                  text-text-primary font-mono text-lg
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                  transition-smooth
                "
              />
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {calculatedTimes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            {activeMode === 'wake-up' ? 'Recommended Bedtimes' : 'Recommended Wake-up Times'}
          </h3>
          
          {calculatedTimes.map((time, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-xl border transition-smooth hover:scale-[1.02]
                ${getQualityColor(time.quality)}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getQualityIcon(time.quality)} 
                    size={20} 
                    className={time.quality === 'optimal' ? 'text-success' : 
                              time.quality === 'good' ? 'text-primary' : 'text-warning'}
                  />
                  <div>
                    <div className="font-mono text-xl font-bold">
                      {activeMode === 'wake-up' ? time.bedTime : time.wakeUpTime}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {time.cycles} cycles • {time.sleepHours}h {time.sleepMinutes}m
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`
                    text-xs font-medium px-2 py-1 rounded-full capitalize
                    ${time.quality === 'optimal' ? 'bg-success/20 text-success' :
                      time.quality === 'good'? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'}
                  `}>
                    {time.quality}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Sleep Tips */}
          <div className="bg-surface/50 backdrop-blur-sm rounded-xl p-4 border border-border mt-6">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-text-primary mb-2">Sleep Tip</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {activeMode === 'wake-up' 
                    ? "Going to bed at these times will help you wake up at the end of a sleep cycle, making you feel more refreshed and alert." :"These wake-up times align with your natural sleep cycles, helping you feel more energized throughout the day."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {calculatedTimes.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Clock" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Set Your {activeMode === 'wake-up' ? 'Wake-up' : 'Bedtime'} Time
          </h3>
          <p className="text-text-secondary">
            Enter a time above to get personalized sleep cycle recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default SleepCalculatorContainer;