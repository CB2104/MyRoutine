export type WorkoutDayId =
  | "lower-a"
  | "upper-a"
  | "lower-b"
  | "upper-b"
  | "special";

export type ExerciseDefinition = {
  id: string;
  name: string;
  target: string;
  equipment: string;
  sets: number;
  minReps: number;
  maxReps: number;
  unit: "reps" | "seconds";
  prescriptionNote?: string;
  gifUrl: string;
  referenceName: string;
  instructions: readonly string[];
};

export type WorkoutDayDefinition = {
  id: WorkoutDayId;
  short: string;
  weekday: string;
  title: string;
  focus: string;
  note: string;
  exercises: readonly ExerciseDefinition[];
};

export type ExerciseLog = {
  completed: boolean;
  weight: number | null;
  reps: Array<number | null>;
  rir: number | null;
  notes: string;
};

export type WorkoutDayLog = {
  exercises: Record<string, ExerciseLog>;
};

export type WorkoutWeek = {
  days: Partial<Record<WorkoutDayId, WorkoutDayLog>>;
};

export type WorkoutStorage = {
  version: 1;
  weeks: Record<string, WorkoutWeek>;
  activeDay?: WorkoutDayId;
  migrationCompleted: boolean;
};
