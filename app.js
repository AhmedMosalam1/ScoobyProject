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
const authRouter = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const offerRoutes = require("./routes/offerRoutes")
const serviceRouter = require("./routes/serviceRoutes")
const plogRouter = require("./routes/plogRout")
const petRouter = require("./routes/petRoutes")
const communityRouter = require("./routes/communityRoutes")
const vetRouter = require("./routes/vetRoutes")
const doctorRouter = require("./routes/doctorsRouts")
const err = require("./controllers/errorController")

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
// cookie: {
//   secure: false, // Set to true if your app is served over HTTPS
//  // httpOnly: true, // Ensures the cookie is only accessed via HTTP(S) requests, not client-side JavaScript
//   maxAge: 3600000 // Cookie lifespan in milliseconds (1 hour in this example)
// }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
//app.use(express_session);
app.use(cookieParser());
app.use(bodyParser.json());

// Routers
app.use('/scooby/api/users',authRouter)
app.use('/scooby/api/user',userRoutes)
app.use("/scooby/api/offer",offerRoutes)
app.use('/scooby/api/services',serviceRouter)
app.use('/scooby/api/Plogs',plogRouter)
app.use('/scooby/api/Pets',petRouter)
app.use('/scooby/api/community',communityRouter)
app.use('/scooby/api/vet',vetRouter)
app.use('/sooby/api/doctors',doctorRouter)

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server `, 404))
})

//app.use(err)

module.exports = app