const seedDatabase = require("./seeder");
const addingData = require("./addingData");
const yargs = require("yargs");
const Task = require("./models/task");

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
    describe: "Add default data from .json  to the data base",
    alias: "seed",
    type: "boolean",
    default: false,
    demandOption: false,
    choices: [true, false],
  })
  .help("h").argv; // TODO: muss noch definiert werden

function addOwnData() {
  addingData.addData().then(process.exit);
}

function seedDummyData() {
  seedDatabase().then(process.exit);
}
if (args.d) {
  addingData
    .question(
      "Are you sure you want to delete all data in the database? (true/false): "
    )
    // TODO: vorhandenen Validator benutzen?
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
    })
    .then(process.exit);
}
if (args.a) {
  addOwnData();
}
if (args.s) {
  seedDummyData();
}

// TODO:mongoose.connection.close();
