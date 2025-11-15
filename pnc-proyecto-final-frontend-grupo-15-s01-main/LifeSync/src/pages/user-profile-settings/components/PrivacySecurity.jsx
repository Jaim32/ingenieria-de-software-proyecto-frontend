import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const PrivacySecurity = ({ onSave }) => {
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginAlerts: true,
    dataSharing: {
      consultationData: true,
      anonymousAnalytics: false,
      thirdPartyIntegrations: true,
      marketingCommunications: false
    },
    sessionTimeout: 30,
    downloadableData: {
      personalInfo: true,
      healthData: true,
      consultationHistory: true,
      activityLogs: true
    }
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const activityLogs = [
    {
      id: 1,
      action: 'Login',
      device: 'Chrome on Windows',
      location: 'San Francisco, CA',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: 2,
      action: 'Password Changed',
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: 3,
      action: 'Failed Login Attempt',
      device: 'Unknown Device',
      location: 'Unknown Location',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'failed'
    },
    {
      id: 4,
      action: 'Data Export',
      device: 'Chrome on Windows',
      location: 'San Francisco, CA',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'success'
    }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleDataSharingChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      dataSharing: {
        ...prev.dataSharing,
        [field]: value
      }
    }));
  };

  const handleDownloadableDataChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      downloadableData: {
        ...prev.downloadableData,
        [field]: value
      }
    }));
  };

  const validatePasswordChange = () => {
    const newErrors = {};

    if (!securitySettings.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!securitySettings.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (securitySettings.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePasswordChange()) {
      // Simulate password change
      console.log('Password changed successfully');
      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setPasswordStrength(0);
    }
  };

  const handleDataExport = () => {
    const selectedData = Object.entries(securitySettings.downloadableData)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    
    console.log('Exporting data:', selectedData);
    // Simulate data export
    alert('Data export initiated. You will receive an email with download links shortly.');
  };

  const handleAccountDeletion = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.'
    );
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        'This is your final warning. Deleting your account will permanently remove all your health data, consultation history, and personal information. Type "DELETE" to confirm.'
      );
      
      if (doubleConfirm) {
        console.log('Account deletion requested');
        alert('Account deletion request submitted. You will receive a confirmation email within 24 hours.');
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'bg-error-500';
      case 2:
        return 'bg-warning-500';
      case 3:
        return 'bg-warning-400';
      case 4:
        return 'bg-success-400';
      case 5:
        return 'bg-success-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return '';
    }
  };

  const handleSave = () => {
    onSave(securitySettings);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Privacy & Security</h2>
          <p className="text-text-secondary">Manage your account security and data privacy settings</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Password Change */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Change Password</h3>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={securitySettings.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className={`input-field pr-10 ${errors.currentPassword ? 'border-error-500' : ''}`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <Icon name={showPasswords.current ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-error-600 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={securitySettings.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className={`input-field pr-10 ${errors.newPassword ? 'border-error-500' : ''}`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <Icon name={showPasswords.new ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
              {securitySettings.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary">{getPasswordStrengthText()}</span>
                  </div>
                </div>
              )}
              {errors.newPassword && (
                <p className="text-error-600 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={securitySettings.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className={`input-field pr-10 ${errors.confirmPassword ? 'border-error-500' : ''}`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <Icon name={showPasswords.confirm ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error-600 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              onClick={handlePasswordSubmit}
              className="btn-primary"
              disabled={!securitySettings.currentPassword || !securitySettings.newPassword || !securitySettings.confirmPassword}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={securitySettings.twoFactorEnabled ? 'Shield' : 'ShieldOff'} 
                  size={20} 
                  className={securitySettings.twoFactorEnabled ? 'text-success-600' : 'text-warning-600'} 
                />
                <span className="font-medium text-text-primary">
                  Two-Factor Authentication {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
              disabled={!isEditing}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                securitySettings.twoFactorEnabled
                  ? 'bg-error-600 text-white hover:bg-error-700' :'bg-success-600 text-white hover:bg-success-700'
              }`}
            >
              {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Login Alerts */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Login Alerts</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-text-primary">Email Login Notifications</span>
              <p className="text-sm text-text-secondary mt-1">
                Get notified when someone signs into your account
              </p>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.loginAlerts}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAlerts: e.target.checked }))}
              disabled={!isEditing}
              className="rounded border-border text-primary-600 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Data Sharing Preferences */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Data Sharing Preferences</h3>
          <div className="space-y-3">
            {Object.entries({
              consultationData: 'Share consultation data with healthcare providers',
              anonymousAnalytics: 'Allow anonymous usage analytics',
              thirdPartyIntegrations: 'Share data with connected third-party apps',
              marketingCommunications: 'Receive marketing communications'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-text-primary">{label}</span>
                <input
                  type="checkbox"
                  checked={securitySettings.dataSharing[key]}
                  onChange={(e) => handleDataSharingChange(key, e.target.checked)}
                  disabled={!isEditing}
                  className="rounded border-border text-primary-600 focus:ring-primary-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Session Management */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Session Management</h3>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Session Timeout (minutes)</label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              disabled={!isEditing}
              className="input-field max-w-xs"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={240}>4 hours</option>
              <option value={0}>Never</option>
            </select>
            <p className="text-sm text-text-secondary mt-1">
              Automatically sign out after period of inactivity
            </p>
          </div>
        </div>

        {/* Data Export */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Data Export</h3>
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Download a copy of your data. Select the types of data you want to include:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries({
                personalInfo: 'Personal Information',
                healthData: 'Health & Fitness Data',
                consultationHistory: 'Consultation History',
                activityLogs: 'Activity Logs'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={securitySettings.downloadableData[key]}
                    onChange={(e) => handleDownloadableDataChange(key, e.target.checked)}
                    className="rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-primary">{label}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleDataExport}
              className="btn-secondary"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="border-b border-border-light pb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.status === 'success' ? 'bg-success-500' : 'bg-error-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{log.action}</p>
                    <p className="text-xs text-text-secondary">
                      {log.device} • {log.location}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-text-secondary">
                  {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Deletion */}
        <div>
          <h3 className="text-lg font-semibold text-error-600 mb-4">Danger Zone</h3>
          <div className="border border-error-200 rounded-lg p-4 bg-error-50">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-error-800">Delete Account</h4>
                <p className="text-sm text-error-700 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={handleAccountDeletion}
                  className="mt-3 px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors duration-200 text-sm font-medium"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurity;