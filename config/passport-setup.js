const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const authController = require('../controllers/authController')
require("dotenv").config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

 passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, async(accessToken, refreshToken, profile, done) =>  {
        // check if user already exists in our own db
        await User.findOne({googleId: profile.id}).then(async(currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                await authController.createSendToken(res,currentUser,200)
                done(null, currentUser);
            } else {
                // if not, create user in our db
                await new User({
                    googleId: profile.id,
                    firstName: profile.name.givenName,
                    lastName:profile.name.familyName,
                    profileImage: profile._json.image.url
                }).save().then(async (newUser) => {
                    console.log('created new user: ', newUser);
                    await authController.createSendToken(res,newUser,201)
                    done(null, newUser);
                });
            }
        });
    })
);

