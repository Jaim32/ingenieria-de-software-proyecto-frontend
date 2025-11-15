// src/pages/authentication-flow-interface/components/LoginForm.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: formData.email,
          contrasenia: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const idUsuario = data.idUsuario;

        if (token && idUsuario) {
          // Obtener datos completos del usuario (incluyendo rol)
          const userRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/usuarios/getById?idUsuario=${idUsuario}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const userData = await userRes.json();
          if (userData?.data) {
            // 1) Guarda el token y el userId
            localStorage.setItem('token', token);
            localStorage.setItem('userId', idUsuario);

            // 2) (opcional) guarda el resto de datos de user si los necesitas
            localStorage.setItem('user', JSON.stringify(userData.data));

            onSuccess?.(userData.data);
            navigate('/daily-nutrition-overview-dashboard');


          } else {
            setErrors({ general: 'Login succeeded but user data could not be loaded.' });
          }
        } else {
          setErrors({ general: 'Invalid login response.' });
        }
      } else {
        setErrors({ general: 'Login failed. Please check your credentials and try again.' });
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
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

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Mail" size={18} />
          </div>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            className={`w-full pl-10 pr-4 py-3 border rounded-wellness wellness-transition focus:outline-none focus:ring-1 ${errors.email
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-secondary-200 focus:border-primary focus:ring-primary'
              }`}
            disabled={isLoading}
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={18} />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password"
            className={`w-full pl-10 pr-12 py-3 border rounded-wellness wellness-transition focus:outline-none focus:ring-1 ${errors.password
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-secondary-200 focus:border-primary focus:ring-primary'
              }`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
      </div>

      <div className="text-right">
        <button
          type="button"
          className="text-sm text-primary hover:text-primary-600"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.email || !formData.password}
        className={`w-full py-3 px-4 rounded-wellness font-medium wellness-transition flex items-center justify-center ${isLoading || !formData.email || !formData.password
          ? 'bg-secondary-200 text-text-secondary cursor-not-allowed'
          : 'bg-primary text-surface hover:bg-primary-600 shadow-wellness'
          }`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin mr-2">
              <Icon name="Loader2" size={18} />
            </div>
            Signing in...
          </>
        ) : (
          <>
            <Icon name="LogIn" size={18} className="mr-2" />
            Sign In
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
