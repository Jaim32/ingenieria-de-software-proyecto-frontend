import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';

const TaskCompletionForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  title = "Add New Taster Profile",
  isModal = false 
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    bio: initialData?.bio || '',
    specialties: initialData?.specialties || [],
    experience: initialData?.experience || 'beginner',
    location: initialData?.location || '',
    avatar: initialData?.avatar || null,
    status: initialData?.status || 'active',
    preferences: {
      emailNotifications: initialData?.preferences?.emailNotifications ?? true,
      publicProfile: initialData?.preferences?.publicProfile ?? false,
      availableForEvents: initialData?.preferences?.availableForEvents ?? true
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(initialData?.avatar || null);

  const specialtyOptions = [
    'Italian Cuisine', 'Asian Fusion', 'Desserts', 'Vegetarian', 'Vegan',
    'Seafood', 'BBQ & Grilling', 'Baking', 'Wine Pairing', 'Cocktails'
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-1 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5+ years)' },
    { value: 'professional', label: 'Professional Chef' }
  ];

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
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
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

  const handlePreferenceChange = (preference, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSubmit) {
        onSubmit(formData);
      } else {
        // Default behavior - navigate back to dashboard
        navigate('/administrative-dashboard');
      }
    } catch (error) {
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/administrative-dashboard');
    }
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary-100 flex items-center justify-center">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="User" size={32} color="#64748B" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors duration-150"
          >
            <Icon name="Camera" size={12} />
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
          >
            Upload Photo
          </button>
          <p className="text-xs text-text-secondary mt-1">JPG, PNG up to 5MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {errors.avatar && <p className="text-error text-sm">{errors.avatar}</p>}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            First Name *
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
            Last Name *
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Email *
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
            Phone
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

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="input-field"
          placeholder="City, State/Country"
        />
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Experience Level
        </label>
        <select
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className="input-field"
        >
          {experienceLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Specialties */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Specialties
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {specialtyOptions.map(specialty => (
            <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.specialties.includes(specialty)}
                onChange={() => handleSpecialtyToggle(specialty)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-primary">{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          className={`input-field resize-none ${errors.bio ? 'border-error' : ''}`}
          placeholder="Tell us about your culinary background and interests..."
        />
        <div className="flex justify-between items-center mt-1">
          {errors.bio && <p className="text-error text-sm">{errors.bio}</p>}
          <p className="text-xs text-text-secondary ml-auto">
            {formData.bio.length}/500 characters
          </p>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="input-field"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Preferences */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Preferences
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.preferences.emailNotifications}
              onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-primary">Email notifications</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.preferences.publicProfile}
              onChange={(e) => handlePreferenceChange('publicProfile', e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-primary">Public profile</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.preferences.availableForEvents}
              onChange={(e) => handlePreferenceChange('availableForEvents', e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-primary">Available for events</span>
          </label>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-3">
          <p className="text-error text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center space-x-2"
        >
          {isSubmitting && <Icon name="Loader2" size={16} className="animate-spin" />}
          <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}</span>
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return <FormContent />;
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-surface rounded-lg shadow-base border border-border p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
            <p className="text-text-secondary mt-1">
              {initialData ? 'Update taster profile information' : 'Create a new taster profile for the community'}
            </p>
          </div>
          <FormContent />
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionForm;