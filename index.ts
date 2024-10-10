import { Command } from "commander";
import { printTasks } from "./app/commands/show";
import { exportToCsV } from "./app/commands/export";
async function main() {
  const program = new Command();
  program
    .name("Clickup-cli")
    .description("CLI to export worked hours from clickup");
  program
    .command("show")
    .description("Show worked hours in a ascii table")
    .action(async () => {
      printTasks();
    });
  program
    .command("export")
    .description("Show worked hours in a ascii table")
    .option("-b, --baht <baht>", "baht per hour")
    .option("-s, --start <start>", "start date")
    .option("-e, --end <end>", "end date")
    .option("-p, --path <path>", "path to save the file")
    .action((args) => {
      exportToCsV(args.path??"./output.csv",args.baht??2,new Date(args.start)??new Date("2024-09-28"),new Date(args.end)??new Date("2024-10-30"));
    });
  program.parse();
}

main();
