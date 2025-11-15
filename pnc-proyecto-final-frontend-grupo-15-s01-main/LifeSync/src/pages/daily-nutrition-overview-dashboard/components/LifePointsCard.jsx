// src/components/ui/LifePointsCard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'components/AppIcon';

const API_BASE = 'http://localhost:8082';

export default function LifePointsCard() {
  const [points, setPoints] = useState(0);
  const [role, setRole] = useState('USER');
  const MAX_POINTS = 750;

  const loadLifePoints = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/rachas/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        console.warn('No autorizado para verificar racha');
        return;
      }
      if (res.status === 404) {
        console.info('Usuario sin racha aún');
        setPoints(0);
        setRole('USER');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Manejo seguro de JSON
      const rawText = await res.text();
      if (!rawText) {
        console.warn('Respuesta vacía al verificar racha');
        setPoints(0);
        setRole('USER');
        return;
      }

      const { puntos, privilegio } = JSON.parse(rawText);
      setPoints(puntos);
      setRole(privilegio ? 'PREMIUM' : 'USER');
    } catch (err) {
      console.error('Error al cargar LifePoints:', err);
      setPoints(0);
    }
  }, []);

  useEffect(() => {
    loadLifePoints();
  }, [loadLifePoints]);

  const progressPercent = Math.min((points / MAX_POINTS) * 100, 100);

  return (
    <div className="bg-surface rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">LifePoints</h3>
        <Icon name="Trophy" size={16} className="text-accent" />
      </div>

      <div className="text-center mb-4">
        <span className="text-2xl font-bold text-text-primary font-data">{points.toLocaleString()}</span>
        <span className="text-sm text-text-secondary"> / {MAX_POINTS} XP</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-nutri-success to-nutri-accent"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-center space-x-2">
        <Icon name="User" size={14} className="text-text-secondary" />
        <span className="text-sm font-medium text-text-primary">{role}</span>
      </div>
    </div>
  );
}
