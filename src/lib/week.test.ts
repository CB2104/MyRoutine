import { describe, expect, it } from "vitest";
import { getIsoWeekId } from "./week";

describe("getIsoWeekId", () => {
  it("mantiene el año ISO al cruzar el año calendario", () => {
    expect(getIsoWeekId(new Date(2027, 0, 1))).toBe("2026-W53");
  });

  it("calcula una semana ordinaria", () => {
    expect(getIsoWeekId(new Date(2026, 7, 8))).toBe("2026-W32");
  });
});
