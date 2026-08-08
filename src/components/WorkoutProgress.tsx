import type { WorkoutDayDefinition, WorkoutDayId } from "../types/workout";
import { m } from "motion/react";

type WorkoutProgressProps = {
  days: readonly WorkoutDayDefinition[];
  completedByDay: Record<WorkoutDayId, number>;
  completedTotal: number;
  exerciseTotal: number;
};

export function WorkoutProgress({
  days,
  completedByDay,
  completedTotal,
  exerciseTotal,
}: WorkoutProgressProps) {
  const percentage = exerciseTotal === 0 ? 0 : (completedTotal / exerciseTotal) * 100;

  return (
    <section className="week-progress" aria-labelledby="week-progress-title">
      <div className="progress-heading">
        <div>
          <p className="eyebrow">Progreso semanal</p>
          <h2 id="week-progress-title">Semana en curso</h2>
        </div>
        <strong>
          {completedTotal} / {exerciseTotal}
        </strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Ejercicios completados esta semana"
        aria-valuemin={0}
        aria-valuemax={exerciseTotal}
        aria-valuenow={completedTotal}
      >
        <m.span
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 150, damping: 24 }}
        />
      </div>
      <div className="week-days" aria-label="Detalle semanal">
        {days.map((day) => {
          const completed = completedByDay[day.id];
          const finished = completed === day.exercises.length;
          return (
            <m.span
              key={day.id}
              animate={finished ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {day.short} {finished ? "✓" : completed > 0 ? `${completed}/${day.exercises.length}` : "–"}
            </m.span>
          );
        })}
      </div>
    </section>
  );
}
