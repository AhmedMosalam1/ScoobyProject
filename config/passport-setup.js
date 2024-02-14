const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
//const keys = require('./keys');
//const User = require('../models/user-model');
const authController = require('../controllers/authController')
const userModel = require('../Models/userModel')
// const express_session = require('express-session');
// app.use(express_session);
require("dotenv").config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

//const GoogleStrategy = require('passport-google-oauth20').Strategy;
 
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://scoobyfamily.onrender.com/scooby/api/users/auth/google/redirect'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists in our own db
            const currentUser = await userModel.findOne({ accountId: profile.id, provider: profile.provider });
            if (currentUser) {
                // User already exists, return the user
                console.log('User found:', currentUser);
                done(null, currentUser);
            } else {
                // User does not exist, create a new user
                const newUser = await userModel.create({
                    accountId: profile.id,
                    name: profile.displayName, // Note the correct spelling of 'displayName'
                    profileImage: profile._json.picture,
                    provider: profile.provider
                });
                console.log('Created new user:', newUser);
                done(null, newUser);
            }
        } catch (err) {
            console.error('Error during Google authentication:', err);
            done(err, null);
        }
    })
)

// //facebook strategy
passport.use(new facebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET_ID,
    callbackURL: "https://scoobyfamily.onrender.com/scooby/api/users/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']

},// facebook will send back the token and profile
    async (res,token, refreshToken, profile, done) => {
        // check if user already exists in our own db
        await userModel.findOne({ accountId: profile.id, provider: profile.provider }).then(async (currentUser) => {
            if (currentUser) {
                // already have this user
                console.log('user is: ', currentUser);
                // await authController.createSendToken(res,currentUser,200)
                done(null, currentUser);
            } else {
                // if not, create user in our db
                await userModel.create({
                    accountId: profile.id,
                    name: profiledispalyName,
                    profileImage: profile._json.picture.data.url,
                    provider: profile.provider,
                    email: profile._json.email,
                }).save().then(async (newUser) => {
                    console.log('created new user: ', newUser);
                    // await authController.createSendToken(res, newUser, 201)
                    done(null, newUser);
                });
            }
        });
    })
);

