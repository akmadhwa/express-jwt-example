const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// Basic express config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

// Mongoose
mongoose.connect("mongodb://localhost/express_jwt", { useNewUrlParser: true });
mongoose.set("debug", true);

// Model
require("./model/User");
require("./config/passport");

// Routes
app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Development error middleware
// Print StackTrace
app.use((err, req, res, next) => {
  console.log(err.stack);

  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});

app.listen(3000, err => {
  if (err) return new Error("Server not connected");
  console.log("Listening to port 3000");
});
