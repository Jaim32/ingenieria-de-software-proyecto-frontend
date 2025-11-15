import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Icon from '../AppIcon';
import ProfileSlide from './ProfileSlide';

export default function ModuleNavigationHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState('USER');
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;
    const { rol } = JSON.parse(stored);
    setRole(rol || 'USER');
  }, []);

  const roleUpper = role.toUpperCase();
  const isSleepMode = location.pathname.startsWith('/sleep-cycle');
  const logoSrc = isSleepMode ? '/images/oscuro.svg' : '/images/Logo.svg';

  /* ─── Módulos base (visibles para todos) ────────────────────── */
  const baseModules = [
    {
      id: 'food-control',
      label: 'Food Control',
      icon: 'Utensils',
      route: '/daily-nutrition-overview-dashboard',
      activeBg: 'bg-orange-50',
      activeBorder: 'border-l-4 border-orange-500',
      activeText: 'text-orange-600',
    },
    {
      id: 'ideal-sleep',
      label: 'Ideal Sleep',
      icon: 'Moon',
      route: '/sleep-cycle',
      activeBg: isSleepMode ? 'bg-primary/10' : 'bg-purple-50',
      activeBorder: isSleepMode
        ? 'border-l-4 border-primary-500'
        : 'border-l-4 border-purple-600',
      activeText: isSleepMode ? 'text-primary-600' : 'text-purple-800',
    },
    {
      id: 'hydro-track',
      label: 'HydroTrack',
      icon: 'Droplets',
      route: '/hydration-tracking-dashboard',
      activeBg: 'bg-blue-50',
      activeBorder: 'border-l-4 border-blue-500',
      activeText: 'text-blue-600',
    },
  ];

  /* ─── Módulo para usuarios ADMIN y PREMIUM ──────────────────── */
  const consultsModule = {
    id: 'consults',
    label: 'Consults',
    icon: 'MessageCircle',
    route: '/ai-wellness-chat',
    activeBg: 'bg-green-50',
    activeBorder: 'border-l-4 border-green-500',
    activeText: 'text-green-600',
  };

  /* ─── Módulos extra según rol ──────────────────────────────── */
  const recipeModeration = {
    id: 'recipe-moderation',
    label: 'Recipe Moderation',
    icon: 'Settings',
    route: '/recipe-moderation-dashboard',
    activeBg: 'bg-yellow-50',
    activeBorder: 'border-l-4 border-yellow-500',
    activeText: 'text-yellow-600',
  };

  const adminDashboard = {
    id: 'admin-dashboard',
    label: 'Admin Dashboard',
    icon: 'Settings',
    route: '/administrative-dashboard',
    activeBg: 'bg-red-50',
    activeBorder: 'border-l-4 border-red-500',
    activeText: 'text-red-600',
  };

  /* ─── Construye el arreglo final de módulos ─────────────────── */
  const modules = [
    ...baseModules,
    ...(['ADMIN', 'PREMIUM'].includes(roleUpper) ? [consultsModule] : []),
    ...(roleUpper === 'CATADOR' ? [recipeModeration] : []),
    ...(roleUpper === 'ADMIN' ? [adminDashboard] : []),
  ];

  /* ─── Funciones auxiliares ──────────────────────────────────── */
  const isActive = m => location.pathname.startsWith(m.route);
  const goTo = m => {
    navigate(m.route);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/authentication-flow-interface?tab=login', { replace: true });
  };

  const hdrBase = 'fixed top-0 left-0 right-0 border-b z-50';
  const hdrDay = 'bg-white border-gray-200';
  const hdrNight = 'theme-sleep bg-background border-border';
  const inactiveBtn = isSleepMode
    ? 'text-secondary hover:text-primary hover:bg-white/5'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';

  /* ─── Render ────────────────────────────────────────────────── */
  return (
    <>
      <header className={`${hdrBase} ${isSleepMode ? hdrNight : hdrDay}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Navegación */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src={logoSrc} alt="Logo" className="h-full object-contain" />
                </div>
                <span className="text-xl font-bold text-gray-900">LifeSync</span>
              </div>
              {/* Navegación desktop */}
              <nav className="hidden md:flex items-center space-x-4">
                {modules.map(m => (
                  <button
                    key={m.id}
                    onClick={() => goTo(m)}
                    className={`
                      flex items-center px-4 py-2 rounded-lg font-medium transition
                      ${isActive(m)
                        ? `${m.activeBg} ${m.activeBorder} ${m.activeText} shadow-sm`
                        : inactiveBtn}
                    `}
                  >
                    <Icon name={m.icon} size={18} className="mr-2" />
                    <span className="text-sm">{m.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Cuenta + toggle móvil */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(v => !v)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Icon name="User" size={20} className={isSleepMode ? 'text-secondary' : ''} />
                </button>
                {isAccountOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                    <button
                      onClick={() => { setProfileOpen(true); setAccountOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => { handleLogout(); setAccountOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                onClick={() => { setMobileOpen(v => !v); setAccountOpen(false); }}
              >
                <Icon
                  name={isMobileOpen ? 'X' : 'Menu'}
                  size={20}
                  className={isSleepMode ? 'text-secondary' : ''}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Navegación móvil */}
        {isMobileOpen && (
          <div className={`md:hidden ${isSleepMode ? 'theme-sleep bg-background border-t border-border' : 'bg-white border-t border-gray-200'}`}>
            <nav className="px-4 py-4 space-y-2">
              {modules.map(m => (
                <button
                  key={m.id}
                  onClick={() => goTo(m)}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-lg transition
                    ${isActive(m) ? `${m.activeBg} ${m.activeBorder} ${m.activeText}` : inactiveBtn}
                  `}
                >
                  <Icon name={m.icon} size={20} className="mr-3" />
                  <span>{m.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Slide-over de perfil */}
      <ProfileSlide isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />

      {/* Contenido */}
      {isSleepMode ? (
        <div className="pt-20 theme-sleep bg-background" style={{ minHeight: 'calc(100vh - 5rem)' }}>
          <Outlet />
        </div>
      ) : (
        <div className="pt-20">
          <Outlet />
        </div>
      )}
    </>
  );
}
