import { useEffect, useState } from "react";
import { m } from "motion/react";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function getEndTime(seconds: number) {
  return Date.now() + seconds * 1000;
}

export function RestTimer() {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (endTime === null) return;

    const update = () => {
      const next = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setEndTime(null);
        setFinished(true);
        if ("vibrate" in navigator) navigator.vibrate([150, 80, 150]);
      }
    };

    update();
    const interval = window.setInterval(update, 250);
    return () => window.clearInterval(interval);
  }, [endTime]);

  function start(seconds: number) {
    setFinished(false);
    setRemaining(seconds);
    setEndTime(getEndTime(seconds));
  }

  return (
    <m.aside
      className="rest-timer"
      data-finished={finished}
      aria-label="Temporizador de descanso"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: finished ? -2 : 0, scale: finished ? 1.008 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <div className="timer-readout" aria-live="polite">
        <span className="eyebrow">{finished ? "Descanso listo" : "Descanso"}</span>
        <strong>{formatTime(remaining)}</strong>
      </div>
      {[90, 120, 180].map((seconds) => (
        <m.button
          type="button"
          key={seconds}
          onClick={() => start(seconds)}
          whileTap={{ scale: 0.92 }}
          whileHover={{ y: -2 }}
        >
          {seconds === 90 ? "90s" : `${seconds / 60}m`}
        </m.button>
      ))}
    </m.aside>
  );
}
