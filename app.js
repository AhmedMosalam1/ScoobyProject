const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const passport = require('passport');
//const express_session = require('express-session');
require("dotenv").config();
require('./config/passport-setup')

//const helmet = require("helmet")

const app = express();

const appError = require("./utils/appError")
const userRouter = require('./routes/authRoutes')
const serviceRouter = require('./routes/serviceRoutes')

///const err = require("./controllers/errorController")

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(express_session({
//   secret: process.env.SESSION_SECRECT,
//   resave: false,
//   saveUninitialized: true,
// }));
// app.use(passport.initialize());
// app.use(passport.session());
//app.use(express_session);
app.use(cookieParser());
app.use(bodyParser.json());

// Routers
app.use('/scooby/api/users',userRouter)
app.use('/scooby/api/services',serviceRouter)

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server `, 404))
})

//app.use(err)

module.exports = app
