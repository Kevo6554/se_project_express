const cors = require("cors");
const express = require("express");
const errorHandler = require("./middleware/error-handler");
const mongoose = require("mongoose");
const indexRoutes = require("./routes/index");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

app.use(express.json());
app.use("/", indexRoutes);
app.use(errorHandler);
app.use(errors());
app.use(requestLogger);
app.use(errorLogger);
app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
