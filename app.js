const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./config/db");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const phonepeRouter = require("./routes/phonePeRoute");
const bodyParser = require("body-parser");
const paytmRoutes = require("./routes/paytmRoutes");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");

const app = express();

connectDB(); // Connect to MongoDB

// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:3001',
//   'https://app.fitnesshptvm.com',
//   'https://admin.fitnesshptvm.com'
// ];
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://app.fitnesshptvm.com",
      "https://admin.fitnesshptvm.com",
    ],
    credentials: true, // Allow credentials
  })
);


// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (e.g., mobile apps, curl requests)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use("/paytm", paytmRoutes);
app.use("/", indexRouter); // Line 31
app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/api", phonepeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
