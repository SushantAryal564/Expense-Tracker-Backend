const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log(err.name, err.message);
  process.exit(1);
});

const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const port = process.env.PORT;

mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  console.log("DB connection successful");
});
const server = app.listen(port, () => {
  console.log(`You are currently listening to port ${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION");
  server.close(() => {
    process.exit(1);
  });
});
