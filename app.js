const mongoose = require("mongoose");
const express = require("express");
const readline = require("readline");
const path = require("path");

// connection to data base
// Verbindung zur Datenbank herstellen
mongoose
  .connect("mongodb://localhost:27017/to_do", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Verbindung erfolgreich hergestellt

    // Daten abrufen und Verbindung schließen
    fetchDataFromDatabase().then(() => mongoose.connection.close());
  })
  .catch((err) => {
    console.error("Fehler bei der Verbindung zur Datenbank:", err);
  });

// Eigene Funktion für das Abrufen von Daten
async function fetchDataFromDatabase() {
  try {
    // Hier wird das Mongoose-Model dynamisch erstellt
    const TaskModel = mongoose.model("Task");

    // Daten abrufen (alle Dokumente in der Kollektion)
    const allData = await TaskModel.find({});

    // Verarbeite die abgerufenen Daten
    console.log("Abgerufene Daten:", allData);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

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

// getting data from data base

// function getAllElements() {
//   path = "mongodb://localhost:27017/to_do/tasks"
//     .fetch(path)
//     .then((data) => console.log(data))
//     .catch((error) => {
//       console.error("Fehler bei der API-Anfrage:", error);
//       console.error(error.message);
//     });
// }

// getAllElements();
// Input questioning in data base structure

async function main() {
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

  rl.close();
}

main();

/// connection to database? same repo?
/// completion date in optional;
