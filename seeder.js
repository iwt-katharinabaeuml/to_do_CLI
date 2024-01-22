const mongoose = require("./db");
const Task = require("./models/task");

async function seedDatabase() {
  try {
    const todos = [
      {
        description: "description 4",
        creationDate: " 02/02/2024",
        completionDate: "02/02/2024",
        priority: "high",
        completed: true,
      },
      {
        description: "description 2",
        creationDate: "02/02/2024",
        completionDate: "02/02/2024",
        priority: "high",
        completed: true,
      },
      {
        description: "description 3",
        creationDate: "02/02/2024",
        completionDate: "02/02/2024",
        priority: "high",
        completed: true,
      },
    ];

    // await Task.deleteMany({}); // löscht alle Daten aus der Datenbank
    await Task.insertMany(todos);

    console.log("Daten erfolgreich eingefügt.");
  } catch (error) {
    console.error("Fehler beim Einfügen von Daten:", error);
  }
}

module.exports = seedDatabase;
