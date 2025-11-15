import React, { useState } from "react";
import Icon from "components/AppIcon";

const SLEEP_CYCLE = 90;       // minutos
const FALL_ASLEEP = 15;      // minutos para conciliar sueño

/* helpers de opciones */
const hours = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
const minutes = ["00", "15", "30", "45"];
const periods = ["AM", "PM"];

/* helpers CSS para fondo / texto / icono */
const qColor = q =>
  q === "optimal" ? "bg-quality-opt"
    : q === "good" ? "bg-quality-good"
      : "bg-quality-min";   // minimum

const qText = q =>
  q === "optimal" ? "text-quality-opt"
    : q === "good" ? "text-quality-good"
      : "text-quality-min";

const qIcon = q => (q === "optimal" ? "Star" : q === "good" ? "CheckCircle" : "Clock");

const BedtimeCalculator = () => {
  const [h, setH] = useState("7");
  const [m, setM] = useState("00");
  const [p, setP] = useState("AM");
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);

  /* ⇢ calcula las posibles horas de dormir */
  const calc = () => {
    let hour = parseInt(h, 10);
    if (p === "PM" && hour !== 12) hour += 12;
    if (p === "AM" && hour === 12) hour = 0;

    const wake = new Date();
    wake.setHours(hour, parseInt(m, 10), 0, 0);
    if (wake < new Date()) wake.setDate(wake.getDate() + 1);

    const res = [];
    for (let cycles = 4; cycles <= 6; cycles++) {
      const total = cycles * SLEEP_CYCLE;
      const bed = new Date(wake.getTime() - (total + FALL_ASLEEP) * 60 * 1000);
      res.push({
        cycles,
        str: bed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        h: Math.floor(total / 60),
        m: total % 60,
        quality: cycles === 5 ? "optimal" : cycles === 6 ? "good" : "minimum",
        rec: cycles === 5
      });
    }
    setList(res);
    setShow(true);
  };

  return (
    <div className="space-y-6">

      {/* --- selector de hora --- */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
        <h3 className="text-lg font-semibold text-primary text-center mb-6">
          What time do you want to wake up?
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Select label="Hour" value={h} onChange={setH} opts={hours} />
          <Select label="Minute" value={m} onChange={setM} opts={minutes} />
          <Select label="Period" value={p} onChange={setP} opts={periods} />
        </div>

        {/* hora elegida */}
        <p className="text-center text-sm text-secondary mb-2">Selected wake-up time:</p>
        <div className="text-center font-mono text-2xl font-bold text-accent mb-6">
          {h}:{m} {p}
        </div>

        <button
          onClick={calc}
          className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-500
                     text-white font-semibold transition-smooth hover:scale-[1.02] active:scale-95
                     shadow-lg hover:shadow-xl">
          <Icon name="Calculator" size={20} className="inline mr-2" />
          Calculate Bedtime
        </button>
      </div>

      {/* --- resultados --- */}
      {show && list.map((b, i) => (
        <div key={i}
          className={`p-4 rounded-xl border-2 ${qColor(b.quality)}
                         transition-smooth hover:scale-[1.02]`}>

          <div className="flex items-center justify-between">
            {/* hora */}
            <div>
              <div className="font-mono text-3xl font-bold text-primary">{b.str}</div>
              <div className="text-xs text-secondary mt-1">{b.h}h {b.m}m sleep</div>
            </div>

            {/* calidad */}
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={qIcon(b.quality)} size={16} className={qText(b.quality)} />
                <span className={`text-xs font-medium capitalize ${qText(b.quality)}`}>
                  {b.quality}
                </span>
              </div>
              <div className="text-xs text-secondary">{b.cycles} cycles</div>
            </div>
          </div>

          {b.rec && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={14} className="text-success-500" />
                <span className="text-xs text-success-500 font-medium">Most recommended</span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* estado inicial */}
      {!show && (
        <div className="text-center py-12">
          <Icon name="Moon" size={48} className="text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">Set your wake-up time</h3>
          <p className="text-secondary">Then we’ll calculate the optimal bedtimes for you.</p>
        </div>
      )}
    </div>
  );
};

/* --- pequeño <select/> reusable --- */
const Select = ({ label, value, onChange, opts }) => (
  <div>
    <label className="block text-sm font-medium text-secondary mb-2">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-3 bg-background border border-border rounded-xl
                 text-primary font-mono text-lg text-center
                 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                 transition-smooth appearance-none cursor-pointer">
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default BedtimeCalculator;
