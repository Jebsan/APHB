/*              app.js -- application core logic and config               */

// core dependencies
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sequelize = require("./database/user-db");
var session = require("express-session");
var passport = require("passport");
var os = require("os"); // Import os module to get network interfaces

// synchronise user models with user-db, then logs
sequelize.sync().then(() => console.log("user-db is ready!"));

// delete every time we restart the server use this instead of the above
//sequelize.sync({ force: true }).then(() => console.log("user-db is ready!"));

// the app object
var app = express();

// create router objects
var indexRouter = require("./routes/index");
var aboutRouter = require("./routes/about");
var contactRouter = require("./routes/contact");
var tipsRouter = require("./routes/tips");
var adminRouter = require("./routes/admin");
var signInRouter = require("./routes/signIn");
var signUpRouter = require("./routes/signUp");
var authRouter = require("./routes/auth");
var profileRouter = require("./routes/profile");
var appsRouter = require("./routes/apps")

// view engine setup/config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app config
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "SECRETKEY", resave: true, saveUninitialized: true })
);
// passports session:
app.use(passport.initialize());
app.use(passport.session());

// tell/configure the app to use these routes
app.use("/", indexRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter);
app.use("/tips", tipsRouter);
app.use("/admin", adminRouter);
app.use("/signIn", signInRouter);
app.use("/signUp", signUpRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/apps", appsRouter);

// serve static files for apps
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// respond to favicon requests with 204 no content (we have no icon yet, dont search for it)
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (let interfaceName in interfaces) {
    const iface = interfaces[interfaceName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost'; // Fallback to localhost if no IP found
}

// Start the server and print the IP address
const port = process.env.PORT || 3001;
app.listen(port, () => {
  const ipAddress = getLocalIpAddress();
  console.log(`App is running! Access it locally at http://localhost:${port}/`);
  console.log(`Or access it on your local network at http://${ipAddress}:${port}/`);
});


// expose this app to scripts that require it, i.e. myapp/bin/www
module.exports = app;
