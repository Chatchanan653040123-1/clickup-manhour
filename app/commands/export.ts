import type { TaskData, TaskResponse } from "../../types";
import { getDuration, splitMonthsWeeksAndYears } from "../core/date";
import fs from "fs";
import { req } from "../core/util";

export async function exportToCsV(
  path: string,
  baht: number,
  startDate: Date,
  endDate: Date
) {
  const teamResponse = await req("https://api.clickup.com/api/v2/team");
  const teamId = teamResponse.teams[0].id;
  const tasksResponse: TaskResponse = await req(
    `https://api.clickup.com/api/v2/team/${teamId}/time_entries`
  );
  const tasksData = tasksResponse.data;
  console.log(tasksData);

  const data: string[][][] = [];

  // Group tasks by space_id
  const groupedTasks: { [key: string]: TaskData[] } = {};

  Object.entries(splitMonthsWeeksAndYears(tasksData)).forEach(([key, tasks]) => {
    tasks.forEach((task) => {
      const spaceId = JSON.stringify(task.task_location.space_id);

      // Initialize the array for the space_id if it doesn't exist
      if (!groupedTasks[spaceId]) {
        groupedTasks[spaceId] = [];
      }

      // Add task to the respective space_id group
      if (startDate <= new Date(task.end * 1) && new Date(task.end * 1) <= endDate) {
        groupedTasks[spaceId].push(task);
      }
    });
  });

  // Process each group of tasks by space_id
  let totalBaht = 0;
  let spaceName = "";
  Object.entries(groupedTasks).forEach(([spaceId, tasks]) => {
    switch (spaceId) {
      case `"90181151609"`:
        spaceName = "MaoMao";
        break;
      case `"90181147772"`:
        spaceName = "KKU-SAC";
        break;
      case `"90181548832"`:
        spaceName = "KKU-DMS & TDX";
        break;
      default:
        spaceName = "Unknown";
    }
    const content: string[][] = [
      [`Space ID: ${spaceId}:${spaceName}`, "Task name", "Duration", "Baht"],
    ];
    let bahtSum = 0;
    tasks.forEach((task) => {
      content.push([
        new Date(task.end * 1).toString(),
        task.task.name+",",
        getDuration(task.start, task.end, "minutes")+ " minutes = ",
        (parseFloat(getDuration(task.start, task.end, "minutes")) * baht).toString() + " Baht",
      ]);
      bahtSum += parseFloat(getDuration(task.start, task.end, "minutes")) * baht;
    });
    totalBaht += bahtSum;
    content.push(["Baht Sum",bahtSum.toString() , "", ""]);
    content.push(["", "", "", ""]);
    data.push(content);
  });

  // Flatten the data and write to CSV
  const flattenedData: string[][] = data.flatMap((table) => [
    ...table,
    ["", "", "", "", ""],
  ]);
  const csvContent = flattenedData.map((row) => row.join("\t")).join("\n")+ "\nTotal "+totalBaht.toString()+" Baht";
  fs.writeFileSync(path, csvContent);
  console.log(`File saved at ${path}`);
}
