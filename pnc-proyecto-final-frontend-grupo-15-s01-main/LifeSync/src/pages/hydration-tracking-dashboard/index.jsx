// src/pages/hydration-tracking-dashboard/index.jsx
import React, { useState, useEffect } from "react";
import WaterBottle from "./components/WaterBottle";
import ProgressBar from "./components/ProgressBar";
import WaterControls from "./components/WaterControls";
import HydrationStats from "./components/HydrationStats";
import HydrationBenefits from "./components/HydrationBenefits";

import HidroAPI, { setAuthToken } from "../../api/apiHidra";

export default function HydrationTrackingDashboard() {
  const token = localStorage.getItem("token");

  /* ---- Estados ---- */
  const [dailyGoal, setDailyGoal] = useState(0);           // ml meta diaria
  const [currentIntake, setCurrentIntake] = useState(0);   // ml consumidos
  const [percentage, setPercentage] = useState(0);         // 0–100%
  const [completed, setCompleted] = useState(false);       // true si ≥100%
  const [customAmount, setCustomAmount] = useState(250);   // ml botón +/–
  const [loading, setLoading] = useState(true);

  /* 1. Inyectar token en el cliente */
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  /* 2. CARGA INICIAL: solo trae del back el status de hidratación */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await HidroAPI.status();
        // data tiene { consumidoMl, metaMl, porcentaje, completado }
        setCurrentIntake(data.consumidoMl);
        setDailyGoal(data.metaMl);
        setPercentage(data.porcentaje);
        setCompleted(data.completado);
      } catch (err) {
        console.error("Error inicializando hidratación:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  /* 3. Add / Remove agua (ml puede ser positivo o negativo) */
  const addWater = async (ml) => {
    try {
      const { data } = await HidroAPI.addWater(ml);
      setCurrentIntake(data.consumidoMl);
      setDailyGoal(data.metaMl);
      setPercentage(data.porcentaje);
      setCompleted(data.completado);
    } catch (err) {
      console.error("Error al actualizar agua", err);
    }
  };

  const quickAdd = () => addWater(customAmount);
  const remove100 = () => addWater(-100);

  /* 4. Cálculos de UI */
  const remaining = Math.max(dailyGoal - currentIntake, 0);

  if (loading) return <p className="text-center pt-20">Loading…</p>;

  /* 5. Render */
  return (
    <div className="theme-hydro min-h-screen bg-background">
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Hydration Tracking Dashboard
            </h1>
            <p className="text-secondary">
              Stay hydrated and track your daily water-intake progress
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* LEFT: Botella + controles */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-center">
                <WaterBottle
                  currentIntake={currentIntake}
                  dailyGoal={dailyGoal}
                  completed={completed}
                />
              </div>

              <ProgressBar
                dailyTarget={dailyGoal}
                currentIntake={currentIntake}
                progressPercentage={percentage}
              />

              <WaterControls
                customAmount={customAmount}
                setCustomAmount={setCustomAmount}
                addWater={() => addWater(customAmount)}
                quickAddWater={quickAdd}
                removeWater={remove100}
              />
            </div>

            {/* RIGHT: Estadísticas */}
            <div className="lg:col-span-1 space-y-6">
              <HydrationStats
                dailyTarget={dailyGoal}
                currentIntake={currentIntake}
                remainingAmount={remaining}
                progressPercentage={percentage}
              />
            </div>
          </div>

          <HydrationBenefits />
        </div>
      </main>
    </div>
  );
}
