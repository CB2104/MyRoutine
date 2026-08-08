import type {
  ExerciseDefinition,
  ExerciseLog,
  WorkoutDayDefinition,
} from "../types/workout";

export function hasExerciseData(log: ExerciseLog): boolean {
  return (
    log.completed ||
    log.weight !== null ||
    log.reps.some((value) => value !== null) ||
    log.rir !== null ||
    log.notes.trim().length > 0
  );
}

export function formatExerciseSummary(
  exercise: ExerciseDefinition,
  log: ExerciseLog,
): string {
  const weight =
    exercise.unit === "seconds" && log.weight === null
      ? "peso corporal"
      : log.weight === null
        ? "- kg"
        : `${log.weight} kg`;
  const reps = log.reps
    .map((value) =>
      value === null ? "-" : `${value}${exercise.unit === "seconds" ? "s" : ""}`,
    )
    .join("/");
  const rir = log.rir === null ? "RIR -" : `RIR ${log.rir}`;
  const notes = log.notes.trim() || "-";

  return `${exercise.name} | ${weight} | ${reps} | ${rir} | ${notes}`;
}

export function formatWorkoutSummary(
  day: WorkoutDayDefinition,
  getLog: (exercise: ExerciseDefinition) => ExerciseLog,
): string {
  const lines = day.exercises
    .map((exercise) => ({ exercise, log: getLog(exercise) }))
    .filter(({ log }) => hasExerciseData(log))
    .map(({ exercise, log }) => formatExerciseSummary(exercise, log));

  return [day.title, day.focus, "", ...(lines.length > 0 ? lines : ["Sin registros todavía."])].join(
    "\n",
  );
}
