import { useEffect, useState } from "react";
import type { ExerciseLog, WorkoutDayId } from "../types/workout";
import {
  getExerciseLog,
  loadWorkoutStorage,
  saveWorkoutStorage,
} from "../lib/storage";
import { findWorkoutDay } from "../data/routine";

export function useWorkoutStorage(weekId: string) {
  const [storage, setStorage] = useState(() =>
    loadWorkoutStorage(window.localStorage),
  );

  useEffect(() => {
    saveWorkoutStorage(window.localStorage, storage);
  }, [storage]);

  function updateExerciseLog(
    dayId: WorkoutDayId,
    exerciseId: string,
    update: Partial<ExerciseLog>,
  ) {
    setStorage((current) => {
      const day = findWorkoutDay(dayId);
      const exercise = day.exercises.find(({ id }) => id === exerciseId);
      if (!exercise) return current;

      const previous = getExerciseLog(current, weekId, dayId, exercise);
      const week = current.weeks[weekId] ?? { days: {} };
      const dayLog = week.days[dayId] ?? { exercises: {} };

      return {
        ...current,
        weeks: {
          ...current.weeks,
          [weekId]: {
            days: {
              ...week.days,
              [dayId]: {
                exercises: {
                  ...dayLog.exercises,
                  [exerciseId]: { ...previous, ...update },
                },
              },
            },
          },
        },
      };
    });
  }

  function setActiveDay(activeDay: WorkoutDayId) {
    setStorage((current) => ({ ...current, activeDay }));
  }

  function resetCurrentWeek() {
    setStorage((current) => {
      const weeks = Object.fromEntries(
        Object.entries(current.weeks).filter(([storedWeekId]) => storedWeekId !== weekId),
      );
      return { ...current, weeks };
    });
  }

  return {
    storage,
    getLog: (dayId: WorkoutDayId, exerciseId: string) => {
      const day = findWorkoutDay(dayId);
      const exercise = day.exercises.find(({ id }) => id === exerciseId);
      return exercise
        ? getExerciseLog(storage, weekId, dayId, exercise)
        : undefined;
    },
    updateExerciseLog,
    setActiveDay,
    resetCurrentWeek,
  };
}
