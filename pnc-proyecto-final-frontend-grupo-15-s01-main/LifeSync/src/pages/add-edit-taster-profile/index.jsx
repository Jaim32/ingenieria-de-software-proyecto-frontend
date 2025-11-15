import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const AddEditTasterProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const isEditMode = searchParams.get('id') !== null;
  const tasterId = searchParams.get('id');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    status: 'active',
    isAdmin: false,
    notes: '',
    avatar: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastModified, setLastModified] = useState(null);

  // Mock data for existing taster (when editing)
  const mockTasterData = {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    username: 'sarah_j',
    status: 'active',
    isAdmin: false,
    notes: `Sarah is an experienced food taster with excellent palate sensitivity. She has been with our community for over 2 years and consistently provides detailed, helpful reviews. 

Her specialty areas include Mediterranean cuisine and artisanal desserts. She's particularly skilled at identifying subtle flavor notes and has helped improve several recipe formulations.`,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    lastModified: new Date(Date.now() - 86400000 * 3) // 3 days ago
  };

  useEffect(() => {
    if (isEditMode && tasterId) {
      // Simulate loading existing taster data
      setTimeout(() => {
        setFormData({
          firstName: mockTasterData.firstName,
          lastName: mockTasterData.lastName,
          email: mockTasterData.email,
          phone: mockTasterData.phone,
          username: mockTasterData.username,
          password: '',
          confirmPassword: '',
          status: mockTasterData.status,
          isAdmin: mockTasterData.isAdmin,
          notes: mockTasterData.notes,
          avatar: mockTasterData.avatar
        });
        setPreviewImage(mockTasterData.avatar);
        setLastModified(mockTasterData.lastModified);
      }, 500);
    }
  }, [isEditMode, tasterId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData(prev => ({ ...prev, avatar: e.target.result }));
        setErrors(prev => ({ ...prev, avatar: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate back to dashboard
      navigate('/administrative-dashboard');
    } catch (error) {
      setErrors({ submit: 'Failed to save taster profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/administrative-dashboard');
  };

  const removeAvatar = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, avatar: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="theme-admin pt-16 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
          <button
            onClick={() => navigate('/administrative-dashboard')}
            className="hover:text-text-primary transition-colors duration-150"
          >
            Dashboard
          </button>
          <Icon name="ChevronRight" size={16} />
          <span>Tasters</span>
          <Icon name="ChevronRight" size={16} />
          <span className="text-text-primary">
            {isEditMode ? formData.firstName || 'Edit Taster' : 'Add New Taster'}
          </span>
        </nav>

        <div className="bg-surface rounded-lg shadow-base border border-border">
          {/* Header */}
          <div className="px-8 py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">
                  {isEditMode ? 'Edit Taster Profile' : 'Add New Taster'}
                </h1>
                <p className="text-text-secondary mt-1">
                  {isEditMode
                    ? 'Update taster profile information and account settings'
                    : 'Create a new taster account for the food community platform'
                  }
                </p>
                {isEditMode && lastModified && (
                  <p className="text-xs text-text-secondary mt-2">
                    Last modified: {lastModified.toLocaleDateString()} at {lastModified.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2 bg-success hover:bg-success-700 text-white px-6 py-2 rounded transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <Icon name="Loader2" size={16} className="animate-spin" />}
                  <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Avatar Upload Section */}
              <div className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div
                      className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-200 ${isDragOver ? 'border-primary bg-primary-50' : 'border-border bg-secondary-50'
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="User" size={48} color="#94A3B8" />
                        </div>
                      )}
                    </div>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-700 transition-colors duration-150"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                    >
                      {previewImage ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <p className="text-xs text-text-secondary">
                      Drag and drop or click to upload • JPG, PNG up to 5MB
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  {errors.avatar && <p className="text-error text-sm">{errors.avatar}</p>}
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="border-b border-border pb-2">
                  <h2 className="text-lg font-medium text-text-primary flex items-center space-x-2">
                    <Icon name="User" size={20} />
                    <span>Personal Information</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      First Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`input-field ${errors.firstName ? 'border-error' : ''}`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Last Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`input-field ${errors.lastName ? 'border-error' : ''}`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`input-field ${errors.email ? 'border-error' : ''}`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`input-field ${errors.phone ? 'border-error' : ''}`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Account Settings Section */}
              <div className="space-y-6">
                <div className="border-b border-border pb-2">
                  <h2 className="text-lg font-medium text-text-primary flex items-center space-x-2">
                    <Icon name="Settings" size={20} />
                    <span>Account Settings</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Username <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`input-field ${errors.username ? 'border-error' : ''}`}
                      placeholder="Enter username"
                    />
                    {errors.username && <p className="text-error text-sm mt-1">{errors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Account Status
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={formData.status === 'active'}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="text-success focus:ring-success"
                        />
                        <span className="status-badge status-success">Active</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={formData.status === 'inactive'}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="text-error focus:ring-error"
                        />
                        <span className="status-badge status-error">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>

                {!isEditMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Password <span className="text-error">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`input-field ${errors.password ? 'border-error' : ''}`}
                        placeholder="Enter password (min. 8 characters)"
                      />
                      {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Confirm Password <span className="text-error">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`input-field ${errors.confirmPassword ? 'border-error' : ''}`}
                        placeholder="Confirm password"
                      />
                      {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Administrative Controls Section */}
              <div className="space-y-6">
                <div className="border-b border-border pb-2">
                  <h2 className="text-lg font-medium text-text-primary flex items-center space-x-2">
                    <Icon name="Shield" size={20} />
                    <span>Administrative Controls</span>
                  </h2>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAdmin}
                      onChange={(e) => handleInputChange('isAdmin', e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <Icon name="Crown" size={18} color="#D97706" />
                      <span className="text-sm font-medium text-text-primary">
                        Grant Administrator Privileges
                      </span>
                    </div>
                  </label>
                  <p className="text-xs text-text-secondary mt-1 ml-6">
                    Administrators can manage other users and access advanced features
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Account Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Add any relevant notes about this taster account..."
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Internal notes visible only to administrators
                  </p>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} color="#DC2626" />
                    <p className="text-error text-sm">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="btn-secondary px-6"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-6 flex items-center space-x-2"
                  style={{ backgroundColor: 'var(--color-success)' }}
                >
                  {isSubmitting && <Icon name="Loader2" size={16} className="animate-spin" />}
                  <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Profile' : 'Create Profile'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditTasterProfile;