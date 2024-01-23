const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/to_do")
  .then(console.log("connected with db"))
  .catch((err) => console.log("Verbindung zur Datenbank nicht möglich ", err));

module.exports = mongoose;
