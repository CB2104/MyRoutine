import type { WorkoutDayDefinition, WorkoutDayId } from "../types/workout";

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
        <button
          className="day-tab"
          data-active={day.id === activeDay}
          type="button"
          key={day.id}
          onClick={() => onSelect(day.id)}
          aria-current={day.id === activeDay ? "page" : undefined}
        >
          <span>{day.short}</span>
          <small>
            {completedByDay[day.id]}/{day.exercises.length}
          </small>
        </button>
      ))}
    </nav>
  );
}
