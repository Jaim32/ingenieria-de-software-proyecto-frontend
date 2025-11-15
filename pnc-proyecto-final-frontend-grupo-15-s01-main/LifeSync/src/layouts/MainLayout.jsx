// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ModuleNavigationHeader from 'components/ui/ModuleNavigationHeader';

export default function MainLayout() {
  return (
    <>
      <ModuleNavigationHeader />
      {/* deja un espacio igual a la altura del header */}
      <div className="pt-20">
        {/* aquí es donde se inyectan TODAS las rutas hijas */}
        <Outlet />
      </div>
    </>
  )
}
