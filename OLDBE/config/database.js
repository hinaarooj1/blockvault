const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(process.env.DATABASE)
    .then((data) => {
      console.log(`Db connected successfully with ${data.connection.host}`);
    })
    .catch((e) => {
      console.log("db error", e);
    });
};

module.exports = database;
