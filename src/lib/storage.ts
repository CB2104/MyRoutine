import { isWorkoutDayId, routine } from "../data/routine";
import type {
  ExerciseDefinition,
  ExerciseLog,
  WorkoutDayId,
  WorkoutStorage,
  WorkoutWeek,
} from "../types/workout";
import { getIsoWeekId } from "./week";

export const STORAGE_KEY = "gym-workout:v1";
const LEGACY_PREFIX = "gym-routine-v1:";
const LEGACY_ACTIVE_DAY_KEY = "gym-active-day";

export type StorageLike = Pick<
  Storage,
  "getItem" | "setItem" | "key" | "length"
>;

export function createEmptyStorage(): WorkoutStorage {
  return {
    version: 1,
    weeks: {},
    migrationCompleted: false,
  };
}

export function createEmptyExerciseLog(
  exercise: ExerciseDefinition,
): ExerciseLog {
  return {
    completed: false,
    weight: null,
    reps: Array.from({ length: exercise.sets }, () => null),
    rir: null,
    notes: "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNullableNumber(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseReps(value: unknown, sets: number): Array<number | null> {
  const rawValues = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[/|,]/)
      : [];

  return Array.from({ length: sets }, (_, index) =>
    toNullableNumber(rawValues[index]),
  );
}

function parseExerciseLog(
  value: unknown,
  exercise: ExerciseDefinition,
): ExerciseLog {
  if (!isRecord(value)) return createEmptyExerciseLog(exercise);

  return {
    completed:
      value.completed === true || value.done === true || value.done === "true",
    weight: toNullableNumber(value.weight),
    reps: parseReps(value.reps, exercise.sets),
    rir: toNullableNumber(value.rir),
    notes: typeof value.notes === "string" ? value.notes.slice(0, 280) : "",
  };
}

function parseWeek(value: unknown): WorkoutWeek {
  const week: WorkoutWeek = { days: {} };
  if (!isRecord(value)) return week;

  const daysValue = isRecord(value.days) ? value.days : {};
  for (const day of routine) {
    const dayValue = daysValue[day.id];
    if (!isRecord(dayValue) || !isRecord(dayValue.exercises)) continue;

    const exercises: Record<string, ExerciseLog> = {};
    for (const exercise of day.exercises) {
      const logValue = dayValue.exercises[exercise.id];
      if (logValue !== undefined) {
        exercises[exercise.id] = parseExerciseLog(logValue, exercise);
      }
    }
    week.days[day.id] = { exercises };
  }

  return week;
}

export function parseWorkoutStorage(value: string | null): WorkoutStorage {
  if (!value) return createEmptyStorage();

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.weeks)) {
      return createEmptyStorage();
    }

    const weeks: Record<string, WorkoutWeek> = {};
    for (const [weekId, weekValue] of Object.entries(parsed.weeks)) {
      if (/^\d{4}-W\d{2}$/.test(weekId)) {
        weeks[weekId] = parseWeek(weekValue);
      }
    }

    return {
      version: 1,
      weeks,
      activeDay: isWorkoutDayId(parsed.activeDay) ? parsed.activeDay : undefined,
      migrationCompleted: parsed.migrationCompleted === true,
    };
  } catch (error: unknown) {
    if (import.meta.env.DEV) {
      console.warn("No se pudo leer el registro local; se usará un estado limpio.", error);
    }
    return createEmptyStorage();
  }
}

function legacyDateToWeekId(dateValue: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return null;
  const date = new Date(`${dateValue}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : getIsoWeekId(date);
}

export function migrateLegacyStorage(
  storage: StorageLike,
  current: WorkoutStorage,
): WorkoutStorage {
  if (current.migrationCompleted) return current;

  const weeks = { ...current.weeks };

  for (let keyIndex = 0; keyIndex < storage.length; keyIndex += 1) {
    const key = storage.key(keyIndex);
    if (!key?.startsWith(LEGACY_PREFIX)) continue;

    const weekId = legacyDateToWeekId(key.slice(LEGACY_PREFIX.length));
    if (!weekId) continue;

    try {
      const parsed: unknown = JSON.parse(storage.getItem(key) ?? "{}");
      if (!isRecord(parsed)) continue;

      const week: WorkoutWeek = weeks[weekId] ?? { days: {} };
      for (const [legacyLogKey, legacyLog] of Object.entries(parsed)) {
        const [dayIdValue, indexValue] = legacyLogKey.split(":");
        if (!isWorkoutDayId(dayIdValue)) continue;

        const exerciseIndex = Number(indexValue);
        const day = routine.find(({ id }) => id === dayIdValue);
        const exercise = day?.exercises[exerciseIndex];
        if (!exercise) continue;

        const dayLog = week.days[dayIdValue] ?? { exercises: {} };
        if (dayLog.exercises[exercise.id] === undefined) {
          dayLog.exercises[exercise.id] = parseExerciseLog(legacyLog, exercise);
        }
        week.days[dayIdValue] = dayLog;
      }
      weeks[weekId] = week;
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        console.warn(`No se pudo migrar el registro legacy ${key}.`, error);
      }
    }
  }

  const legacyActiveDay = storage.getItem(LEGACY_ACTIVE_DAY_KEY);
  return {
    version: 1,
    weeks,
    activeDay:
      current.activeDay ??
      (isWorkoutDayId(legacyActiveDay) ? legacyActiveDay : undefined),
    migrationCompleted: true,
  };
}

export function loadWorkoutStorage(storage: StorageLike): WorkoutStorage {
  return migrateLegacyStorage(
    storage,
    parseWorkoutStorage(storage.getItem(STORAGE_KEY)),
  );
}

export function saveWorkoutStorage(
  storage: StorageLike,
  workoutStorage: WorkoutStorage,
) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(workoutStorage));
  } catch (error: unknown) {
    console.warn("No se pudo guardar el entrenamiento en este dispositivo.", error);
  }
}

export function getExerciseLog(
  storage: WorkoutStorage,
  weekId: string,
  dayId: WorkoutDayId,
  exercise: ExerciseDefinition,
) {
  return (
    storage.weeks[weekId]?.days[dayId]?.exercises[exercise.id] ??
    createEmptyExerciseLog(exercise)
  );
}
