// src/layouts/QuestionsLayout.jsx
import React from 'react';
import NavigationStateProvider from '../components/ui/NavigationStateManager';
import { Outlet } from 'react-router-dom';

export default function QuestionsLayout() {
  return (
    <div className="theme-questions"> {/* opcional: aquí aplicas un scope CSS distinto */}
      <NavigationStateProvider>
        <Outlet />
      </NavigationStateProvider>
    </div>
  );
}
