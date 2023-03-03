const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down ...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const client = require("./appMQTT");
const app = require("./appHTTP");
const AppError = require("./utils/appError");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`HTML App listening on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHADLER REJECTION! Shutting down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});