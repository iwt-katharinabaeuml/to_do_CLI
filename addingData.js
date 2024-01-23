const Task = require("./models/task");
const readline = require("readline");

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
const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);

// validator creation date

async function isDateValid(dateStr) {
  if (new Date(dateStr) < currentDate) {
    return false;
  } else if (new Date(dateStr) == currentDate) {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr) && !isNaN(new Date(dateStr));
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
      process.exit();
    } catch (error) {
      console.error("Fehler beim Einfügen von Daten:", error);
      process.exit();
    }
  }
  await addToDatabase();
}

module.exports = { addData, isDateValid, isCompletionDateValid, question };
