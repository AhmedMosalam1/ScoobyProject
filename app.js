const express = require("express");
const morgan = require("morgan");
//const helmet = require("helmet")


const app = express();



// Routers
const appError = require("./utils/appError")
///const err = require("./controllers/errorController")


if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server `, 404))
})

//app.use(err)

module.exports = app
