import type { WorkoutDayDefinition, WorkoutDayId } from "../types/workout";
import { m } from "motion/react";

type DayTabsProps = {
  days: readonly WorkoutDayDefinition[];
  activeDay: WorkoutDayId;
  completedByDay: Record<WorkoutDayId, number>;
  onSelect: (dayId: WorkoutDayId) => void;
};

export function DayTabs({
  days,
  activeDay,
  completedByDay,
  onSelect,
}: DayTabsProps) {
  return (
    <nav className="day-tabs" aria-label="Días de entrenamiento">
      {days.map((day) => (
        <m.button
          className="day-tab"
          data-active={day.id === activeDay}
          type="button"
          key={day.id}
          onClick={() => onSelect(day.id)}
          aria-current={day.id === activeDay ? "page" : undefined}
          whileTap={{ scale: 0.94 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.16 }}
        >
          {day.id === activeDay ? (
            <m.span
              className="day-tab__active"
              layoutId="active-day-tab"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
              aria-hidden="true"
            />
          ) : null}
          <span className="day-tab__label">{day.short}</span>
          <small className="day-tab__progress">
            {completedByDay[day.id]}/{day.exercises.length}
          </small>
        </m.button>
      ))}
    </nav>
  );
}
