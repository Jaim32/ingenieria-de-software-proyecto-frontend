import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default function AuthenticationFlowInterface() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const params    = new URLSearchParams(location.search);

  /* qué pestaña abrir */
  const initialTab = params.get('tab') === 'login' ? 'login' : 'register';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);

  /* 👇 respuestas que vienen del cuestionario */
  const prefillData = location.state?.prefill || {};

  /* ───────────── Handlers ───────────── */
  const handleTabChange = (tab) => setActiveTab(tab);

  const handleLoginSuccess = () => navigate('/daily-nutrition-overview-dashboard');

  const handleRegisterSuccess = () =>
    setTimeout(() => navigate('/daily-nutrition-overview-dashboard'), 50);

  return (
    <div className="theme-questions min-h-screen bg-questions-gradient flex items-center justify-center px-4 py-8">
      {/* ← Back */}
      <button
        onClick={() => navigate('/question-flow-interface')}
        className="absolute top-6 left-6 flex items-center text-text-secondary hover:text-text-primary transition"
      >
        <Icon name="ChevronLeft" size={18} className="mr-1" />
        Back to questionnaire
      </button>

      <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-background rounded-full flex items-center justify-center shadow">
            <Icon name="Leaf" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Welcome to Wellness
          </h1>
          <p className="text-sm text-text-secondary">
            Create your account to save your wellness progress and get personalized recommendations
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-lg overflow-hidden">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 font-medium transition ${
              activeTab === 'login'
                ? 'bg-primary text-surface shadow'
                : 'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-2 font-medium transition ${
              activeTab === 'register'
                ? 'bg-primary text-surface shadow'
                : 'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Formulario */}
        {activeTab === 'login' ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : (
          <RegisterForm
            prefillData={prefillData}                
            onSuccess={handleRegisterSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </div>
  );
}
