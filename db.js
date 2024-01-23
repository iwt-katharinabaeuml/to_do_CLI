const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/to_do")
  .then(console.log("connected with db"))
  .catch((err) =>
    console.log("connection-error: database not available ", err)
  );

module.exports = mongoose;
