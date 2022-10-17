const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const port = process.env.PORT;

mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  console.log("DB connection successful");
});
app.listen(port, () => {
  console.log(`You are currently listening to port ${port}`);
});
