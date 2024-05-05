import { table } from "table";
import { getDuration, splitMonthsWeeksAndYears } from "../core/date";
import type { TaskResponse } from "../../types";
import { req } from "../core/util";

export async function printTasks() {
  const teamResponse = await req("https://api.clickup.com/api/v2/team");
  const teamId = teamResponse.teams[0].id;
  const tasksResponse: TaskResponse = await req(
    `https://api.clickup.com/api/v2/team/${teamId}/time_entries`,
  );
  const tasksData = tasksResponse.data;
  Object.entries(splitMonthsWeeksAndYears(tasksData)).map(([key, tasks]) => {
    const content: string[][] = [];
    content.push([key, "Task url", "Task name", "Date", "Duration"]);

    tasks.forEach((task) =>
      content.push([
        "",
        task.task_url,
        task.task.name,
        new Date(task.end * 1).toUTCString(),
        getDuration(task.start, task.end, "nice"),
      ]),
    );

    content.push([
      "",
      "",
      "",
      "",
      `sum: ${new Date(tasks.reduce((acc, task) => acc + (task.end - task.start), 0)).getHours()}h`,
    ]);
    console.log(table(content));
  });
}
