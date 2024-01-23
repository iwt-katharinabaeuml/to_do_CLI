const Task = require("./models/task");
const tasks = require("./dummyData.json");

function seedDatabase() {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Task.insertMany(tasks);
      console.log("Seed data added");
      resolve(result);
    } catch (error) {
      console.error("Seed data could not be added!", error);
      reject(error);
    }
  });
}

module.exports = seedDatabase;
