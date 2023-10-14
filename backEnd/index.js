// const express = require("express");

// const path = require("path");
// const cookieParser = require("cookie-parser");
// const logger = require("morgan");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// // const cookies = require("./middlewares/cookies")

// const indexRouter = require("./routes/index");
// const authRouter = require("./routes/auth");
// const postRoutes = require("./routes/posts");

// var app = express();

// app.use(cors());
// // app.use(cookies);
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));



// const MongoClient = require('mongodb').MongoClient;
// require('dotenv').config();

// const uri = `mongodb+srv://mostafamostafaramadan144:mos258852@cluster0.iiprckc.mongodb.net/?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect((err) => {
//   if (err) {
//     console.error('حدث خطأ أثناء الاتصال بقاعدة البيانات:', err);
//   } else {
//     console.log('تم الاتصال بقاعدة البيانات بنجاح');

//     app.use("*/images", express.static(__dirname + "/public/images"));

//     app.use("/", indexRouter);
//     app.use("/api/account", authRouter);
//     app.use("/api/", postRoutes);
    

//   }
// });



// mongoose.connect(process.env.DB_URL);
// module.exports = app;




const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const postRoutes = require("./routes/posts");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));


mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB successfully");

  app.use("/", indexRouter);
  app.use("/api/account", authRouter);
  app.use("/api", postRoutes);
});

module.exports = app;
