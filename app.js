//const mongoose = require("mongoose");
const express = require("express");
const readline = require("readline");
const mongoose = require("./db");
const seedDatabase = require("./seeder");
const yargs = require("yargs");

// validator handling
function question(prompt, validator) {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(prompt, async (answer) => {
        if (!validator || (await validator(answer))) {
          resolve(answer);
        } else {
          console.log("Invalid input. Please try again.");
          ask();
        }
      });
    };
    ask();
  });
}

var args = yargs
  .option("d", {
    describe: "Delete the whole database data",
    alias: "delete",
    type: "boolean",
    default: false,
    demandOption: false,
    choices: [true, false],
  })
  .option("a", {
    describe: "Add a new element to the data base",
    alias: "delete",
    type: "boolean",
    default: false,
    demandOption: false,
    choices: [true, false],
  })
  .help("h").argv;

if (args.d) {
  question("Do you sure you want delete all data in the data base?", (answer) =>
    /^(true|false|t|f)$/i.test(answer)
  );

  if (answer == true || answer == t) {
    Task.deleteMany({});
  }
  //deleteWholeDatabase();
}

//build up CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const currentDate = new Date();

// validator creation date

async function isDateValid(dateStr) {
  if (new Date(dateStr) < currentDate) {
    return false;
  } else {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr) && !isNaN(new Date(dateStr));
  }
}
// validator completion date
async function isCompletionDateValid(dateStr) {
  if (!dateStr) {
    console.log("kein Datum eingegeben");

    return true;
  } else {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr) && !isNaN(new Date(dateStr));
  }
}

async function addData() {
  const description = await question("Description: ");
  const creationDate = await question(
    "Date of creation (MM/DD/YYYY): ",
    isDateValid
  );
  let completionDate = await question(
    "Date of completion (MM/DD/YYYY): ",
    isCompletionDateValid
  );

  let completed = await question("Completed (true/false):", (answer) =>
    /^(true|false|t|f)$/i.test(answer)
  );
  let priority = await question("Priority (high/medium/low/none): ", (answer) =>
    /^(high|medium|low|none|h|m|l|n)$/i.test(answer)
  );

  console.log("\nTask:");
  console.log("Description:", description);
  console.log("Creation Date:", new Date(creationDate));
  console.log("Completion Date:", completionDate);
  console.log(
    "Completed:",
    completed.toLowerCase() === "true" || completed.toLowerCase() === "t"
  );

  if (priority.length == 1) {
    switch (priority) {
      case "h":
        priority = "high";
        break;
      case "m":
        priority = "medium";
        break;
      case "l":
        priority = "low";
        break;
      case "n":
        priority = "none";
        break;
    }
  }

  if (["high", "medium", "low", "none"].includes(priority)) {
    console.log("Priority:", priority.toLowerCase());
  }

  yargs.command({
    command: "back", // Befehl, um zur CLI-Anwendung zurückzukehren
    describe: "Return to the CLI application",
    handler: () => {
      // Hier kannst du weitere Aktionen ausführen, wenn der 'back'-Befehl eingegeben wird
      console.log("Returning to the CLI application...");
      rl.close(); // Schließe das readline-Interface, um zur CLI zurückzukehren
    },
  }).argv;
}

addData();

function seedDummyData() {
  seedDatabase().then(() => console.log("Data added"));
}
// mongoose.connection.close()
