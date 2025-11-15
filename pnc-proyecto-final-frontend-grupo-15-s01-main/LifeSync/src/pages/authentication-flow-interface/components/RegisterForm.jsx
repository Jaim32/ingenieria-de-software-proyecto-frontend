import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const RegisterForm = ({ prefillData = {}, onSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    edad:         prefillData.edad         ?? '',
    peso:         prefillData.peso         ?? '',
    altura:       prefillData.altura       ?? '',
    objetivoPeso: prefillData.objetivoPeso ?? '',
    genero: '' // ← nuevo campo
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.edad || isNaN(formData.edad)) {
      newErrors.edad = 'Edad es requerida';
    }
    if (!formData.peso || isNaN(formData.peso)) {
      newErrors.peso = 'Peso es requerido';
    }
    if (!formData.altura || isNaN(formData.altura)) {
      newErrors.altura = 'Altura es requerida';
    }
    if (!formData.objetivoPeso || isNaN(formData.objetivoPeso)) {
      newErrors.objetivoPeso = 'Objetivo de peso es requerido';
    }

    if (!formData.genero) {
      newErrors.genero = 'Género es requerido';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const userPayload = {
      nombre: formData.name,
      correo: formData.email,
      contrasenia: formData.password,
      edad: parseInt(formData.edad),
      peso: parseFloat(formData.peso),
      altura: parseFloat(formData.altura),
      objetivoPeso: parseFloat(formData.objetivoPeso),
      genero: formData.genero
    };

    try {
      const response = await fetch('http://localhost:8082/api/usuarios/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      if (!response.ok) throw new Error('Failed to register');
      const data = await response.json();
      onSuccess?.(data);
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-wellness text-sm text-error">
          <div className="flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-2 flex-shrink-0" />
            {errors.general}
          </div>
        </div>
      )}

      {/* Full Name */}
      <InputField
        id="name"
        label="Full Name"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Enter your full name"
        icon="User"
        error={errors.name}
        disabled={isLoading}
      />

      {/* Email */}
      <InputField
        id="register-email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Enter your email"
        icon="Mail"
        error={errors.email}
        disabled={isLoading}
      />

      {/* Password */}
      <PasswordField
        id="register-password"
        label="Password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        show={showPassword}
        setShow={setShowPassword}
        error={errors.password}
        disabled={isLoading}
      />

      {/* Confirm Password */}
      <PasswordField
        id="confirm-password"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
        show={showConfirmPassword}
        setShow={setShowConfirmPassword}
        error={errors.confirmPassword}
        disabled={isLoading}
      />

      {/* Edad */}
      <NumericField
        id="edad"
        label="Edad"
        value={formData.edad}
        onChange={(e) => handleInputChange('edad', e.target.value)}
        error={errors.edad}
        disabled={isLoading}
      />

      {/* Peso */}
      <NumericField
        id="peso"
        label="Peso (kg)"
        value={formData.peso}
        step="0.1"
        onChange={(e) => handleInputChange('peso', e.target.value)}
        error={errors.peso}
        disabled={isLoading}
      />

      {/* Altura */}
      <NumericField
        id="altura"
        label="Altura (cm)"
        value={formData.altura}
        step="0.1"
        onChange={(e) => handleInputChange('altura', e.target.value)}
        error={errors.altura}
        disabled={isLoading}
      />

      {/* Objetivo de Peso */}
      <NumericField
        id="objetivoPeso"
        label="Objetivo de Peso (kg)"
        value={formData.objetivoPeso}
        step="0.1"
        onChange={(e) => handleInputChange('objetivoPeso', e.target.value)}
        error={errors.objetivoPeso}
        disabled={isLoading}
      />

      {/* Género */}
      <div>
        <label htmlFor="genero" className="block text-sm font-medium text-text-primary mb-2">Género</label>
        <select
          id="genero"
          value={formData.genero}
          onChange={(e) => handleInputChange('genero', e.target.value)}
          className={`w-full p-3 border rounded-wellness wellness-transition focus:outline-none focus:ring-1 ${errors.genero ? 'border-error focus:border-error focus:ring-error' : 'border-secondary-200 focus:border-primary focus:ring-primary'}`}
          disabled={isLoading}
        >
          <option value="">Selecciona tu género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
        {errors.genero && <p className="mt-1 text-sm text-error">{errors.genero}</p>}
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className={`mt-1 h-4 w-4 rounded ${errors.agreeToTerms ? 'text-error border-error focus:ring-error' : 'text-primary border-secondary-300 focus:ring-primary'} wellness-focus wellness-transition`}
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-text-secondary">
            I agree to the{' '}
            <button type="button" className="text-primary hover:text-primary-600 wellness-transition" disabled={isLoading}>Terms and Conditions</button> and{' '}
            <button type="button" className="text-primary hover:text-primary-600 wellness-transition" disabled={isLoading}>Privacy Policy</button>
          </span>
        </label>
        {errors.agreeToTerms && <p className="mt-1 text-sm text-error">{errors.agreeToTerms}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={
          isLoading ||
          !formData.name ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword ||
          !formData.genero ||
          !formData.agreeToTerms
        }
        className={`w-full py-3 px-4 rounded-wellness font-medium wellness-transition flex items-center justify-center ${
          isLoading
            ? 'bg-secondary-200 text-text-secondary cursor-not-allowed'
            : 'bg-primary text-surface hover:bg-primary-600 shadow-wellness'
        }`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin mr-2">
              <Icon name="Loader2" size={18} />
            </div>
            Creating account...
          </>
        ) : (
          <>
            <Icon name="UserPlus" size={18} className="mr-2" />
            Create Account
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;

// Input components (puedes moverlos a otro archivo si prefieres)
const InputField = ({ id, label, value, onChange, placeholder, icon, error, disabled, type = 'text' }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name={icon} size={18} color="var(--color-text-secondary)" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 border rounded-wellness wellness-transition focus:outline-none focus:ring-1 ${error ? 'border-error focus:border-error focus:ring-error' : 'border-secondary-200 focus:border-primary focus:ring-primary'}`}
        disabled={disabled}
      />
    </div>
    {error && <p className="mt-1 text-sm text-error">{error}</p>}
  </div>
);

const PasswordField = ({ id, label, value, onChange, show, setShow, error, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name="Lock" size={18} color="var(--color-text-secondary)" />
      </div>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`w-full pl-10 pr-12 py-3 border rounded-wellness wellness-transition focus:outline-none focus:ring-1 ${error ? 'border-error focus:border-error focus:ring-error' : 'border-secondary-200 focus:border-primary focus:ring-primary'}`}
        disabled={disabled}
      />
      <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary wellness-transition" disabled={disabled}>
        <Icon name={show ? 'EyeOff' : 'Eye'} size={18} />
      </button>
    </div>
    {error && <p className="mt-1 text-sm text-error">{error}</p>}
  </div>
);

const NumericField = ({ id, label, value, onChange, error, disabled, step = '1' }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-2">{label}</label>
    <input
      id={id}
      type="number"
      min="0"
      step={step}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border rounded-wellness wellness-transition focus:outline-none focus:ring-1 ${error ? 'border-error focus:border-error focus:ring-error' : 'border-secondary-200 focus:border-primary focus:ring-primary'}`}
      disabled={disabled}
    />
    {error && <p className="mt-1 text-sm text-error">{error}</p>}
  </div>
);
