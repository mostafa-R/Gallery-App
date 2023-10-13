const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// const cookies = require("./middlewares/cookies")

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const postRoutes = require("./routes/posts");

var app = express();

app.use(cors());
// app.use(cookies);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("*/images", express.static(__dirname + "/public/images"));

app.use("/", indexRouter);
app.use("/api/account", authRouter);
app.use("/api/", postRoutes);



app.use((err, req, res, next) => {
  if (
    err.name === "mongoError" ||
    err.name === "validtionError" ||
    err.name === "castError"
  ) {
    err.status = 422;
  }
  if (req.get("accept").includes("json")) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "some error eccured." });
  } else {
    res
      .status(err.status || 500)
      .sendFile(path.join(__dirname, "puplic", "index.html"));
  }
});

mongoose.connect(process.env.DB_URL);
module.exports = app;
