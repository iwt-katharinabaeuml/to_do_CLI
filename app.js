const readline = require("readline");
const seedDatabase = require("./seeder");
const yargs = require("yargs");
const Task = require("./models/task");

//build up CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
    alias: "add",
    type: "boolean",
    default: false,
    demandOption: false,
    choices: [true, false],
  })
  .option("s", {
    describe: "Add a default data to the data base",
    alias: "seed",
    type: "boolean",
    default: false,
    demandOption: false,
    choices: [true, false],
  })
  .help("h").argv;

// .finally(() => {
//   // Hier kann Code platziert werden, der nach dem Löschen oder Abbrechen ausgeführt werden soll
//   // Beispiel: Öffnen Sie die CLI für neue Befehle
//   rl.setPrompt('Enter your command: '); // Setze den Prompt-Text
//   rl.prompt(); // Zeige den Prompt wieder an
// });

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

  if (completed === "t") {
    completed = true;
  }
  if (completed === "f") {
    completed = false;
  }
  let priority = await question("Priority (high/medium/low/none): ", (answer) =>
    /^(high|medium|low|none|h|m|l|n)$/i.test(answer)
  );

  console.log("\nTask:");
  console.log("Description:", description);
  console.log("Creation Date:", new Date(creationDate));
  console.log("Completion Date:", completionDate);
  console.log("Completed:", completed);

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
  addToDatabase();
  async function addToDatabase() {
    try {
      const tasks = [
        {
          description: description,
          creationDate: creationDate,
          completionDate: completionDate,
          priority: priority,
          completed: completed,
        },
      ];
      // await Task.deleteMany({}); // löscht alle Daten aus der Datenbank
      await Task.insertMany(tasks);

      console.log("Daten erfolgreich eingefügt.");
    } catch (error) {
      console.error("Fehler beim Einfügen von Daten:", error);
    }
  }
}

function seedDummyData() {
  seedDatabase().then(() => console.log("Data added"));
}
if (args.d) {
  question(
    "Are you sure you want to delete all data in the database? (true/false): "
  )
    // TODO: vorhandenen Validator benutzen!
    .then((answer) => {
      if (/^(true|false|t|f)$/i.test(answer)) {
        return answer.toLowerCase() === "true" || answer.toLowerCase() === "t";
      } else {
        throw new Error("Invalid input. Deletion aborted.");
      }
    })
    .then((shouldDelete) => {
      if (shouldDelete) {
        return Task.deleteMany({});
      } else {
        throw new Error("Deletion aborted.");
      }
    })
    .then(() => {
      console.log("Database data successfully deleted.");
    })
    .catch((error) => {
      console.error("Data could not be deleted", error.message);
    });
}
if (args.a) {
  addData();
}
if (args.s) {
  seedDummyData();
}
// mongoose.connection.close();
