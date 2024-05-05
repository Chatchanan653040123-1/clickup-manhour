import type { TaskData, TaskResponse } from "../../types";
import { getDuration, splitMonthsWeeksAndYears } from "../core/date";
import fs from "fs";
import { req } from "../core/util";
export async function exportToCsV(path: string) {
  const teamResponse = await req("https://api.clickup.com/api/v2/team");
  const teamId = teamResponse.teams[0].id;
  const tasksResponse: TaskResponse = await req(
    `https://api.clickup.com/api/v2/team/${teamId}/time_entries`,
  );
  const tasksData = tasksResponse.data;

  const data: string[][][] = [];
  Object.entries(splitMonthsWeeksAndYears(tasksData)).forEach(
    ([key, tasks]) => {
      const content: string[][] = [
        [key, "Task url", "Task name", "Date", "Duration (hours)"],
      ];
      tasks.forEach((task) =>
        content.push([
          "",
          task.task_url,
          task.task.name,
          new Date(task.end * 1).toUTCString(),
          getDuration(task.start, task.end, "hours"),
        ]),
      );

      content.push(["", "", "", "", ""]);
      data.push(content);
    },
  );
  const flattenedData: string[][] = data.flatMap((table) => [
    ...table,
    ["", "", "", "", ""],
  ]);
  const csvContent = flattenedData.map((row) => row.join("\t")).join("\n");
  fs.writeFileSync(path, csvContent);
  console.log(`File saved at ${path}`);
}
