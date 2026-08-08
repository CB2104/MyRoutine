import { describe, expect, it } from "vitest";
import { routine } from "../data/routine";
import { createEmptyExerciseLog } from "./storage";
import { formatExerciseSummary } from "./workout-summary";

describe("formatExerciseSummary", () => {
  it("formatea peso, series, RIR y notas", () => {
    const exercise = routine[1].exercises[0];
    const log = {
      ...createEmptyExerciseLog(exercise),
      weight: 100,
      reps: [12, 11, 10],
      rir: 2,
      notes: "Buena técnica",
    };

    expect(formatExerciseSummary(exercise, log)).toBe(
      "Jalón al pecho | 100 kg | 12/11/10 | RIR 2 | Buena técnica",
    );
  });

  it("usa peso corporal y segundos en la plancha", () => {
    const exercise = routine[4].exercises[5];
    const log = {
      ...createEmptyExerciseLog(exercise),
      reps: [45, 45, 40],
      rir: 2,
    };

    expect(formatExerciseSummary(exercise, log)).toBe(
      "Plancha | peso corporal | 45s/45s/40s | RIR 2 | -",
    );
  });
});
