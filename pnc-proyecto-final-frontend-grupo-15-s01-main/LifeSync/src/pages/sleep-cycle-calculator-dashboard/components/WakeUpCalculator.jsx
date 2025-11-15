import React, { useState, useEffect } from "react";
import Icon from "components/AppIcon";

const SLEEP_CYCLE = 90;
const FALL_ASLEEP = 15;

/* helpers de color / texto */
const qColor = q =>
  q === "optimal" ? "bg-quality-opt"
    : q === "good" ? "bg-quality-good"
      : q === "extended" ? "bg-quality-ext"
        : "bg-quality-min";

const qText = q =>
  q === "optimal" ? "text-quality-opt"
    : q === "good" ? "text-quality-good"
      : q === "extended" ? "text-quality-ext"
        : "text-quality-min";

const qIcon = q =>
  q === "optimal" ? "Star"
    : q === "good" ? "CheckCircle"
      : q === "extended" ? "Clock"
        : "AlertCircle";

const WakeUpCalculator = ({ currentTime }) => {
  const [times, setTimes] = useState([]);
  const [showMore, setShow] = useState(false);

  useEffect(() => {
    const now = new Date(currentTime);
    const list = [];
    for (let cycles = 4; cycles <= 8; cycles++) {
      const total = cycles * SLEEP_CYCLE;
      const t = new Date(now.getTime() + (total + FALL_ASLEEP) * 60 * 1000);
      list.push({
        cycles,
        str: t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        h: Math.floor(total / 60),
        m: total % 60,
        quality: cycles === 5 ? "optimal" : cycles === 6 ? "good" : cycles >= 7 ? "extended" : "minimum",
        recommended: cycles === 5 || cycles === 6
      });
    }
    setTimes(list);
  }, [currentTime]);

  const shown = showMore ? times : times.slice(0, 5);

  return (
    <div className="space-y-6">

      {/* cabecera */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg text-center">
        <p className="text-sm font-medium text-secondary mb-2">If you go to sleep now</p>
        <div className="font-mono text-2xl font-bold text-accent mb-2">
          {currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </div>
        <p className="text-xs text-secondary">You should wake up at one of these times:</p>
      </div>

      <h3 className="text-lg font-semibold text-primary">Recommended Wake-up Times</h3>

      {shown.map((t, i) => (
        <div key={i}
          className={`p-4 rounded-xl border-2 ${qColor(t.quality)}
                         transition-smooth hover:scale-[1.02] cursor-pointer
                         ${t.recommended ? "ring-2 ring-primary/20" : ""}`}>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-3xl font-bold text-primary">{t.str}</div>
              <div className="text-xs text-secondary mt-1">{t.h}h {t.m}m sleep</div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={qIcon(t.quality)} size={16} className={qText(t.quality)} />
                <span className={`text-xs font-medium capitalize ${qText(t.quality)}`}>
                  {t.quality}
                </span>
              </div>
              <div className="text-xs text-secondary">{t.cycles} cycles</div>
            </div>
          </div>

          {t.recommended && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={14} className="text-primary-500" />
                <span className="text-xs text-primary-500 font-medium">Recommended</span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* botones more/less */}
      {!showMore && times.length > 5 && (
        <button onClick={() => setShow(true)}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10
                           border border-border text-secondary hover:text-primary transition-smooth">
          <Icon name="ChevronDown" size={16} className="inline mr-2" />
          More suggestions
        </button>
      )}
      {showMore && (
        <button onClick={() => setShow(false)}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10
                           border border-border text-secondary hover:text-primary transition-smooth">
          <Icon name="ChevronUp" size={16} className="inline mr-2" />
          Show less
        </button>
      )}
    </div>
  );
};

export default WakeUpCalculator;
