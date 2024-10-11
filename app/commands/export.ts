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
  let totalMinutes = 0; 
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
      [`Space ID: ${spaceId}:${spaceName}`,",Date",",Time", ",Task name", ",Duration(minutes)", ",Baht"],
    ];
    let bahtSum = 0;
    let minuteSum = 0;
    tasks.forEach((task) => {
      content.push([
        ",",
        new Date(task.end * 1).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }) + ",",
        task.task.name.replace(",", '') + ",",
        getDuration(task.start, task.end, "minutes") + " minutes,",
        (parseFloat(getDuration(task.start, task.end, "minutes")) * baht).toString() + " Baht",
      ]);
      bahtSum += parseFloat(getDuration(task.start, task.end, "minutes")) * baht;
      minuteSum += parseFloat(getDuration(task.start, task.end, "minutes"));
      console.log(minuteSum);
    });
    totalBaht += bahtSum;
    totalMinutes += minuteSum;
    content.push([",",",","," , ",", "Baht Sum,", bahtSum.toString()]);
    content.push([",",",",",", ",", "Minutes Sum,", minuteSum.toString()]);
    data.push(content);
  });

  // Flatten the data and write to CSV
  const flattenedData: string[][] = data.flatMap((table) => [
    ...table,
    ["","", "", "", "", ""],
  ]);
  const fs = require('fs');

  // Your existing data processing
  const csvContent = "\uFEFF" + flattenedData.map((row) => row.join("\t")).join("\n") + "\nTotal ," + totalBaht.toString() + ", Baht"+ "\n," + totalMinutes.toString() + " Minutes";
  
  // Write the file with UTF-8 encoding
  fs.writeFileSync(path, csvContent, { encoding: 'utf8' });
  console.log(`File saved at ${path}`);
}
