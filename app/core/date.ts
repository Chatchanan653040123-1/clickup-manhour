import type { TaskData } from "../../types";

export function getDuration(timestamp1: number, timestamp2: number, format: "nice" | "hours"|"minutes") {
  const diff = timestamp2 - timestamp1;
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  switch (format) {
    case "nice":
      return `${hours}h ${minutes}m ${seconds}s`
    case "hours":
      return `${Math.round(diff / (10 * 60 * 60)) / 100}`
    case "minutes":
      return `${Math.round(diff / (10 * 60)) / 100}`
  }
}

export function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const diff = Math.floor((date.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24));
  return Math.ceil((diff + firstDayOfMonth.getDay()) / 7);
}

export function splitMonthsWeeksAndYears(tasks: TaskData[]): Record<string, TaskData[]> {
  let tasksByMonthWeek: Record<string, TaskData[]> = {};

  tasks.forEach(task => {
    const date = new Date(task.start * 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const weekOfMonth = date;
    const key = `${month}/${year}/Week ${weekOfMonth}`;

    if (!tasksByMonthWeek[key]) {
      tasksByMonthWeek[key] = [task];
    } else {
      tasksByMonthWeek[key].push(task);
    }
  });

  return tasksByMonthWeek;
}

