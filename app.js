const express = require("express");
const morgan = require("morgan");
const compression = require("compression")
const cookieParser = require("cookie-parser")
const session = require('express-session');
const bodyParser = require("body-parser")
const passport = require('passport');
const cors = require("cors")


require("dotenv").config();
require('./config/passport-setup')

//const helmet = require("helmet")

const app = express();

const appError = require("./utils/appError")
const mountRoutes = require('./routes/appRoutes')
const { webhookCheckout } = require("./controllers/orderControllers");



const err = require("./controllers/errorController")

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

// Use CORS with the specified options
app.use(cors(corsOptions));

// Handle OPTIONS requests
app.options('*', cors(corsOptions));

app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout)

app.use(express.json());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(express_session({
//   secret: process.env.SESSION_SECRECT,
//   resave: false,
//   saveUninitialized: true,
// cookie: {
//   secure: false, // Set to true if your app is served over HTTPS
//  // httpOnly: true, // Ensures the cookie is only accessed via HTTP(S) requests, not client-side JavaScript
//   maxAge: 3600000 // Cookie lifespan in milliseconds (1 hour in this example)
// }
// }));
app.use(session({
  secret: 'scoobyFamily', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: false } // Set secure to true if using HTTPS
}));

 app.use(passport.initialize());
 app.use(passport.session());

//app.use(express_session);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression())


// Routers
mountRoutes(app)

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server `, 404))
})

app.use(err)

module.exports = app
