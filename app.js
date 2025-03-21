const express = require("express");
const mongoose = require("mongoose");
const indexRoutes = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

app.use((req, res, next) => {
  req.user = {
    _id: "67cf2951c7ab5c32d69abbad", // Replace with a valid ObjectId
  };
  next();
});
app.use(express.json());
app.use("/", indexRoutes);
app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Id provided was not found" });
});
app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
