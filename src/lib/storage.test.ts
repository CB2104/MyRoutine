import { describe, expect, it } from "vitest";
import { migrateLegacyStorage, parseWorkoutStorage } from "./storage";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
}

describe("workout storage", () => {
  it("tolera JSON corrupto", () => {
    expect(parseWorkoutStorage("{bad-json")).toMatchObject({
      version: 1,
      weeks: {},
      migrationCompleted: false,
    });
  });

  it("migra el formato legacy sin borrarlo", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "gym-routine-v1:2026-08-03",
      JSON.stringify({
        "upper-a:0": {
          done: true,
          weight: "100",
          reps: "12/11/10",
          rir: "2",
          notes: "Bien",
        },
      }),
    );

    const migrated = migrateLegacyStorage(storage, parseWorkoutStorage(null));
    const log =
      migrated.weeks["2026-W32"]?.days["upper-a"]?.exercises[
        "upper-a-pulldown"
      ];

    expect(log).toMatchObject({
      completed: true,
      weight: 100,
      reps: [12, 11, 10],
      rir: 2,
      notes: "Bien",
    });
    expect(storage.getItem("gym-routine-v1:2026-08-03")).not.toBeNull();
  });
});
