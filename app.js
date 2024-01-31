const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const passport = require('passport');
require("dotenv").config();



//const helmet = require("helmet")


const app = express();


const appError = require("./utils/appError")
const userRouter = require('./routes/authRoutes')

///const err = require("./controllers/errorController")

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// Routers
app.use('/scooby/api/users',userRouter)

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server `, 404))
})

//app.use(err)

module.exports = app
