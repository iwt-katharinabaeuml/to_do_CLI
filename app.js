const mongoose = require("mongoose");
const express = require("express");
const readline = require("readline");

// connection to data base
mongoose
  .connect("mongodb://localhost:27017/to_do")
  .catch((err) => console.log(err));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

async function isDateValid(dateStr) {
  if (new Date(dateStr) < currentDate) {
    return false;
  } else {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr) && !isNaN(new Date(dateStr));
  }
}

async function isCompletionDateValid(dateStr) {
  if (!dateStr) {
    console.log("kein Datum eingegeben");

    return true;
  } else {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr) && !isNaN(new Date(dateStr));
  }
}

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
