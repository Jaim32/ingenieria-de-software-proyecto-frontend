// src/pages/sleep-cycle-calculator-dashboard/index.jsx
import React, { useState, useEffect } from "react";
import TimeDisplayCard from "components/ui/TimeDisplayCard";
import WakeUpCalculator from "./components/WakeUpCalculator";
import BedtimeCalculator from "./components/BedtimeCalculator";
import Icon from "components/AppIcon";

export default function SleepCycleCalculatorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [active, setActive] = useState("wake-up");

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const btnBase = `
    py-3 px-4 rounded-xl font-medium text-sm transition-smooth
    flex items-center justify-center gap-2
  `;
  const btnActive = "bg-primary-600 text-white shadow-lg ring-2 ring-primary-400/40";
  const btnInactive = "text-secondary hover:text-primary hover:bg-white/5";

  return (
    <div
      className="theme-sleep bg-background pt-20"
      style={{ minHeight: "calc(100vh - 5rem)" }}
    >
      <main className="max-w-4xl mx-auto px-4 pb-8">
        <div className="space-y-6">
          <TimeDisplayCard />

          {/* selector de modo */}
          <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-1 border border-border shadow-lg">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setActive("wake-up")}
                className={`${btnBase} ${active === "wake-up" ? btnActive : btnInactive}`}
              >
                <Icon name="Sun" size={16} /> Wake Up Calculator
              </button>
              <button
                onClick={() => setActive("bedtime")}
                className={`${btnBase} ${active === "bedtime" ? btnActive : btnInactive}`}
              >
                <Icon name="Moon" size={16} /> Bedtime Calculator
              </button>
            </div>
          </div>

          {/* calculadora */}
          {active === "wake-up" ? (
            <WakeUpCalculator currentTime={currentTime} />
          ) : (
            <BedtimeCalculator />
          )}
        </div>
      </main>
    </div>
  );
}
