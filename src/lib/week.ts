const DAY_IN_MS = 86_400_000;

export function getIsoWeekId(input: Date = new Date()): string {
  const date = new Date(
    Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()),
  );
  const day = date.getUTCDay() || 7;

  date.setUTCDate(date.getUTCDate() + 4 - day);
  const year = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / DAY_IN_MS + 1) / 7);

  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function getWorkoutDayForToday(input: Date = new Date()) {
  return (
    {
      1: "lower-a",
      2: "upper-a",
      4: "lower-b",
      5: "upper-b",
      6: "special",
    } as const
  )[input.getDay()];
}
