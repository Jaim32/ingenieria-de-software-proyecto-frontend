import React, { useRef, useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function ImageUploadSection({ imagePreview, onImageUpload }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    onImageUpload(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-surface rounded-card p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Camera" size={16} color="white" />
        </div>
        <h3 className="font-heading font-heading-semibold text-lg text-text-primary">
          Recipe Image
        </h3>
      </div>

      {imagePreview ? (
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Recipe preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center transition-smooth hover:bg-opacity-80"
              aria-label="Remove image"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-border-color rounded-lg text-text-primary transition-smooth hover:border-primary hover:bg-background"
          >
            <Icon name="RefreshCw" size={18} />
            <span className="font-body font-body-medium">Change Image</span>
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer ${
            isDragOver 
              ? 'border-primary bg-primary bg-opacity-5' :'border-border-color hover:border-primary hover:bg-background'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Upload" size={24} color="var(--color-text-secondary)" />
            </div>
            
            <div>
              <h4 className="font-body font-body-medium text-text-primary mb-2">
                Upload Recipe Image
              </h4>
              <p className="text-sm text-text-secondary mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-xs text-text-secondary">
                Supports: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
            
            <button
              type="button"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-body font-body-medium transition-smooth hover:bg-opacity-90"
            >
              <Icon name="Plus" size={18} />
              <span>Choose Image</span>
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUploadSection;