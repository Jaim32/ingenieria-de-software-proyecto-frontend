
// src/pages/daily-nutrition-overview-dashboard/index.jsx
import React, { useState, useEffect } from "react";
import Icon from "components/AppIcon";

import CalorieProgressCard    from "./components/CalorieProgressCard";
import MacronutrientCard      from "./components/MacronutrientCard";
import LifePointsCard         from "./components/LifePointsCard";
import CalorieTimeline        from "./components/CalorieTimeline";
import QuickMealLogger        from "./components/QuickMealLogger";
import MacronutrientBreakdown from "./components/MacronutrientBreakdown";
// API clients and token configurators
import HidroAPI, { setAuthToken as setHydroToken }      from "../../api/apiHidra";
import PlatilloAPI from "../../api/apiPlatillo";
import ArchiveAPI, { configure as setArchiveToken } from "../../api/apiArchive";
import UserAPI,       { setUserAuth }                     from "../../api/apiUser";
const stored = JSON.parse(localStorage.getItem("user") || "{}");
const userIdFromStorage = stored.idUsuario;

export default function DailyNutritionOverviewDashboard() {
  /* ─── Estados generales ─────────────────────────── */
  const token = localStorage.getItem("token");
  const [currentDate, setCurrentDate] = useState(new Date());

  /* ─── Estados de hidratación y platillos ───────── */
  const [hydration, setHydration] = useState({
    consumidoMl:0, metaMl:0, porcentaje:0, completado:false
  });
  const [platillos, setPlatillos] = useState([]);

  function formatLocalDate(d) {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
  /* ─── Carga y sincronización ────────────────────── */
  const [loading,    setLoading]    = useState(true);
  const [syncStatus, setSyncStatus] = useState("synced");

  // 1) Inyectar token en todos los clientes
useEffect(() => {
  // apiHidra → setAuthToken renombrado
  setHydroToken(token);

  // apiUser → setUserAuth
  setUserAuth(token);

  // apiArchive → configure renombrado a setArchiveToken
  setArchiveToken(token);

  // apiPlatillo → método configure en el default export
  PlatilloAPI.configure(token);
}, [token]);

  // 2) Formateo de fechas
const fechaStr = formatLocalDate(currentDate);
const hoyStr   = formatLocalDate(new Date());
const isToday  = fechaStr === hoyStr;
  // 3) Carga de datos en vivo o archive según la fecha
 useEffect(() => {
  if (!token || !userIdFromStorage) return;

  (async () => {
    setLoading(true);
    setSyncStatus("syncing");
     console.log("📅 fechaStr:", fechaStr, "| isToday?", isToday);
    console.log("👤 userId:", userIdFromStorage);
    try {
      if (isToday) {
        // Hoy: datos “en vivo”
                console.log("→ Cargando datos en vivo");

        const [{ data: h }, { data: p }] = await Promise.all([
          HidroAPI.status({ usuarioId: userIdFromStorage, date: fechaStr }),
          PlatilloAPI.getPlatillosByDate(userIdFromStorage, fechaStr)
        ]);
        
        setHydration(h);
        setPlatillos(p || []);
      } else {
                console.log("→ Cargando snapshot de archivo");

        // Pasado: sacamos snapshot
const { data: archive } = await ArchiveAPI.getArchive(userIdFromStorage, fechaStr);  
        console.log("← Archivo recibido:", archive);

 setHydration(
          archive.hidratacion ?? { consumidoMl:0, metaMl:0, porcentaje:0, completado:false }
        );
        setPlatillos(archive.platillos ?? []);
      }
    } catch (err) {
      console.warn("Error cargando snapshot:", err);
      setHydration({ consumidoMl:0, metaMl:0, porcentaje:0, completado:false });
      setPlatillos([]);
    } finally {
      
      console.log({ fechaStr, isToday });
      setSyncStatus("synced");
      setLoading(false); 

      
    }
  })();
}, [token, userIdFromStorage, fechaStr, isToday]);

  // 4) Navegación de fechas
  const navigateDate = (dir) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  if (loading) return <p className="text-center pt-20">Loading…</p>;

  // 5) Cálculo restante de hidratación
  const remaining = Math.max(hydration.metaMl - hydration.consumidoMl, 0);

  return (
    <div className="theme-nutri min-h-screen bg-background text-primary p-6">
      {/* Header con selector de fecha */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigateDate(-1)}>
            <Icon name="ChevronLeft" size={20} />
          </button>
          <div>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric" })}
            </h2>
            <p className="text-sm text-secondary">Daily Nutrition Overview</p>
          </div>
          <button
  onClick={() => !isToday && navigateDate(1)}
  disabled={isToday}
  className={isToday ? "opacity-50 cursor-not-allowed" : ""}
>
  <Icon name="ChevronRight" size={20} />
</button>

        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-secondary">Sync:</span>
          <Icon
            name={syncStatus === "synced" ? "CheckCircle" : "RefreshCw"}
            size={16}
            className={syncStatus === "synced" ? "text-success" : "text-warning animate-spin"}
          />
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <CalorieProgressCard />
        <MacronutrientCard />

        <div className="card text-center">
  <h4 className="font-semibold text-primary mb-2">Today's Progress</h4>

  <div className="text-3xl font-bold text-secondary-600 mb-2">
    {hydration.consumidoMl}
    <span className="text-tertiary mx-2">/</span>
    <span className="text-2xl font-bold">{hydration.metaMl} ml</span>
  </div>

  <div className="w-full bg-border h-2 rounded-full">
    <div
      className="h-2 rounded-full transition-all duration-500"
      style={{
        width: `${hydration.porcentaje}%`,
        backgroundColor: "#2563EB",
        backgroundImage: "linear-gradient(to right, #2563EB, rgb(154, 143, 255))",
      }}
    />
  </div>
</div>


        <LifePointsCard />
      </section>

     {/* Timeline + Quick log */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
  <div className="lg:col-span-8">
    <CalorieTimeline
      meals={Array.isArray(platillos) ? platillos : []}
      totalCalories={
        Array.isArray(platillos)
          ? platillos.reduce((sum, p) => sum + (p.caloriasTotales || 0), 0)
          : 0
      }
    />
  </div>
  <div className="lg:col-span-4">


          <QuickMealLogger />
        </div>
      </section>

      {/* Macronutrient Breakdown */}
      <section className="mb-12">
        <MacronutrientBreakdown macro={`undefined`} />
      </section>
    </div>
);}
