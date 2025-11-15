import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const Preferences = ({ onSave }) => {
  const [preferences, setPreferences] = useState({
    // Dietary Restrictions
    dietaryRestrictions: ['vegetarian', 'gluten-free'],
    allergies: ['nuts', 'shellfish'],
    
    // Health Goals
    healthGoals: {
      weightGoal: 'maintain',
      activityLevel: 'moderate',
      sleepGoal: 8,
      waterIntakeGoal: 2.5
    },
    
    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      mealReminders: true,
      sleepReminders: true,
      hydrationReminders: true,
      consultationAlerts: true,
      weeklyReports: true,
      reminderFrequency: 'daily'
    },
    
    // Module Customizations
    moduleSettings: {
      defaultMeasurementUnit: 'metric',
      dashboardWidgets: ['nutrition', 'sleep', 'hydration', 'consultations'],
      compactMode: false,
      showTips: true
    },
    
    // Consultation Preferences
    consultationPreferences: {
      availability: {
        monday: { enabled: true, start: '09:00', end: '17:00' },
        tuesday: { enabled: true, start: '09:00', end: '17:00' },
        wednesday: { enabled: true, start: '09:00', end: '17:00' },
        thursday: { enabled: true, start: '09:00', end: '17:00' },
        friday: { enabled: true, start: '09:00', end: '17:00' },
        saturday: { enabled: false, start: '10:00', end: '14:00' },
        sunday: { enabled: false, start: '10:00', end: '14:00' }
      },
      preferredConsultationType: 'video',
      autoAcceptBookings: false,
      bufferTime: 15
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'dairy-free', label: 'Dairy-Free' },
    { id: 'keto', label: 'Ketogenic' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'low-carb', label: 'Low Carb' },
    { id: 'mediterranean', label: 'Mediterranean' }
  ];

  const allergyOptions = [
    { id: 'nuts', label: 'Tree Nuts' },
    { id: 'peanuts', label: 'Peanuts' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'fish', label: 'Fish' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'soy', label: 'Soy' },
    { id: 'wheat', label: 'Wheat' }
  ];

  const dashboardWidgetOptions = [
    { id: 'nutrition', label: 'Nutrition Tracker', icon: 'Utensils' },
    { id: 'sleep', label: 'Sleep Monitor', icon: 'Moon' },
    { id: 'hydration', label: 'Hydration Tracker', icon: 'Droplets' },
    { id: 'consultations', label: 'Consultations', icon: 'MessageCircle' },
    { id: 'goals', label: 'Health Goals', icon: 'Target' },
    { id: 'progress', label: 'Progress Charts', icon: 'TrendingUp' }
  ];

  const handlePreferenceChange = (section, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setPreferences(prev => ({
      ...prev,
      consultationPreferences: {
        ...prev.consultationPreferences,
        availability: {
          ...prev.consultationPreferences.availability,
          [day]: {
            ...prev.consultationPreferences.availability[day],
            [field]: value
          }
        }
      }
    }));
  };

  const handleSave = () => {
    onSave(preferences);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Preferences</h2>
          <p className="text-text-secondary">Customize your experience and module settings</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Save Preferences
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Edit Preferences
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Dietary Restrictions */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Dietary Restrictions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dietaryOptions.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.dietaryRestrictions.includes(option.id)}
                  onChange={() => handleArrayToggle('dietaryRestrictions', option.id)}
                  disabled={!isEditing}
                  className="rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-text-primary">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Allergies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allergyOptions.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.allergies.includes(option.id)}
                  onChange={() => handleArrayToggle('allergies', option.id)}
                  disabled={!isEditing}
                  className="rounded border-border text-error-600 focus:ring-error-500"
                />
                <span className="text-sm text-text-primary">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Health Goals */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Health Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Weight Goal</label>
              <select
                value={preferences.healthGoals.weightGoal}
                onChange={(e) => handlePreferenceChange('healthGoals', 'weightGoal', e.target.value)}
                disabled={!isEditing}
                className="input-field"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Activity Level</label>
              <select
                value={preferences.healthGoals.activityLevel}
                onChange={(e) => handlePreferenceChange('healthGoals', 'activityLevel', e.target.value)}
                disabled={!isEditing}
                className="input-field"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Very Active</option>
                <option value="extra-active">Extra Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Sleep Goal (hours)</label>
              <input
                type="number"
                min="6"
                max="12"
                step="0.5"
                value={preferences.healthGoals.sleepGoal}
                onChange={(e) => handlePreferenceChange('healthGoals', 'sleepGoal', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Water Intake Goal (liters)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={preferences.healthGoals.waterIntakeGoal}
                onChange={(e) => handlePreferenceChange('healthGoals', 'waterIntakeGoal', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                emailNotifications: 'Email Notifications',
                pushNotifications: 'Push Notifications',
                mealReminders: 'Meal Reminders',
                sleepReminders: 'Sleep Reminders',
                hydrationReminders: 'Hydration Reminders',
                consultationAlerts: 'Consultation Alerts',
                weeklyReports: 'Weekly Reports'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-text-primary">{label}</span>
                  <input
                    type="checkbox"
                    checked={preferences.notifications[key]}
                    onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Reminder Frequency</label>
              <select
                value={preferences.notifications.reminderFrequency}
                onChange={(e) => handlePreferenceChange('notifications', 'reminderFrequency', e.target.value)}
                disabled={!isEditing}
                className="input-field max-w-xs"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Module Settings */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Module Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Measurement Units</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="measurementUnit"
                    value="metric"
                    checked={preferences.moduleSettings.defaultMeasurementUnit === 'metric'}
                    onChange={(e) => handlePreferenceChange('moduleSettings', 'defaultMeasurementUnit', e.target.value)}
                    disabled={!isEditing}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-primary">Metric (kg, cm, L)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="measurementUnit"
                    value="imperial"
                    checked={preferences.moduleSettings.defaultMeasurementUnit === 'imperial'}
                    onChange={(e) => handlePreferenceChange('moduleSettings', 'defaultMeasurementUnit', e.target.value)}
                    disabled={!isEditing}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-primary">Imperial (lbs, ft, fl oz)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">Dashboard Widgets</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dashboardWidgetOptions.map((widget) => (
                  <label key={widget.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.moduleSettings.dashboardWidgets.includes(widget.id)}
                      onChange={() => {
                        const currentWidgets = preferences.moduleSettings.dashboardWidgets;
                        const newWidgets = currentWidgets.includes(widget.id)
                          ? currentWidgets.filter(w => w !== widget.id)
                          : [...currentWidgets, widget.id];
                        handlePreferenceChange('moduleSettings', 'dashboardWidgets', newWidgets);
                      }}
                      disabled={!isEditing}
                      className="rounded border-border text-primary-600 focus:ring-primary-500"
                    />
                    <Icon name={widget.icon} size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{widget.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-text-primary">Compact Mode</span>
                <p className="text-xs text-text-secondary">Use smaller interface elements</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.moduleSettings.compactMode}
                onChange={(e) => handlePreferenceChange('moduleSettings', 'compactMode', e.target.checked)}
                disabled={!isEditing}
                className="rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-text-primary">Show Tips</span>
                <p className="text-xs text-text-secondary">Display helpful tips and guidance</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.moduleSettings.showTips}
                onChange={(e) => handlePreferenceChange('moduleSettings', 'showTips', e.target.checked)}
                disabled={!isEditing}
                className="rounded border-border text-primary-600 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Consultation Availability */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Consultation Availability</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Preferred Consultation Type</label>
              <select
                value={preferences.consultationPreferences.preferredConsultationType}
                onChange={(e) => handlePreferenceChange('consultationPreferences', 'preferredConsultationType', e.target.value)}
                disabled={!isEditing}
                className="input-field max-w-xs"
              >
                <option value="video">Video Call</option>
                <option value="audio">Audio Call</option>
                <option value="chat">Text Chat</option>
                <option value="in-person">In Person</option>
              </select>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-text-primary">Weekly Availability</h4>
              {Object.entries(preferences.consultationPreferences.availability).map(([day, schedule]) => (
                <div key={day} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-20">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) => handleAvailabilityChange(day, 'enabled', e.target.checked)}
                        disabled={!isEditing}
                        className="rounded border-border text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-text-primary capitalize">{day}</span>
                    </label>
                  </div>
                  {schedule.enabled && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        disabled={!isEditing}
                        className="input-field text-sm"
                      />
                      <span className="text-text-secondary">to</span>
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        disabled={!isEditing}
                        className="input-field text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-text-primary">Auto-Accept Bookings</span>
                  <p className="text-xs text-text-secondary">Automatically accept consultation requests</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.consultationPreferences.autoAcceptBookings}
                  onChange={(e) => handlePreferenceChange('consultationPreferences', 'autoAcceptBookings', e.target.checked)}
                  disabled={!isEditing}
                  className="rounded border-border text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Buffer Time (minutes)</label>
                <select
                  value={preferences.consultationPreferences.bufferTime}
                  onChange={(e) => handlePreferenceChange('consultationPreferences', 'bufferTime', parseInt(e.target.value))}
                  disabled={!isEditing}
                  className="input-field"
                >
                  <option value={0}>No Buffer</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;