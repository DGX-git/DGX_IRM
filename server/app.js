// require("dotenv").config();

// var createError = require("http-errors");
// var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
// var cors = require("cors");

// var indexRouter = require("./routes/index");
// var registerRouter = require("./routes/register");
// var loginRouter = require("./routes/login");
// var usersRouter = require("./routes/users");
// var instancerequestRouter = require("./routes/instancerequest");
// var userProfile = require("./routes/profile");
// var technicaladminRouter = require("./routes/technicaladmin");
// var functionaladminRouter = require("./routes/functionaladmin");
// var emailsRouter = require("./routes/emails");

// var app = express();

// app.use(cors());

// // view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");
// // Serve Next.js static files (CSS, JS, images, etc.)
// app.use("/_next/static", express.static(path.join(__dirname, "client/.next/static"), { maxAge: "1 year", immutable: true}));

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "client/public")));

// app.use("/", indexRouter);
// app.use("/register", registerRouter);
// app.use("/login", loginRouter);
// app.use("/profile", userProfile);
// app.use("/users", usersRouter);
// app.use("/instancerequest", instancerequestRouter);
// app.use("/technicaladmin", technicaladminRouter);
// app.use("/functionaladmin", functionaladminRouter);
// app.use("/emails", emailsRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`:rocket: Server running on port ${PORT}`);
// });

// module.exports = app;




require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const next = require("next");

var indexRouter = require("./routes/index");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var usersRouter = require("./routes/users");
var instancerequestRouter = require("./routes/instancerequest");
var userProfile = require("./routes/profile");
var technicaladminRouter = require("./routes/technicaladmin");
var functionaladminRouter = require("./routes/functionaladmin");
var emailsRouter = require("./routes/emails");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "client") });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  var app = express();

  app.use(cors());

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Serve static files from public folder
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "client/public")));

  // API routes
  app.use("/register", registerRouter);
  app.use("/login", loginRouter);
  app.use("/profile", userProfile);
  app.use("/users", usersRouter);
  app.use("/instancerequest", instancerequestRouter);
  app.use("/technicaladmin", technicaladminRouter);
  app.use("/functionaladmin", functionaladminRouter);
  app.use("/emails", emailsRouter);

  // Next.js handler for all other routes
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });

  const PORT = process.env.PORT || 5100;
  app.listen(PORT, () => {
    console.log(`:rocket: Server running on port ${PORT}`);
  });
});

module.exports = nextApp;