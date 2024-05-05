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
    .option("-p, --path <path>", "path to save the file")
    .action((args) => {
      exportToCsV(args.path??"./output.csv")
    });
  program.parse();
}

main();
