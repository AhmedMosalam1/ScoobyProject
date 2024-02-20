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

 //facebook strategy
passport.use(new facebookStrategy({
    // Pull in our app id and secret from environment variables
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET_ID,
    callbackURL: "https://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']
}, async (token, refreshToken, profile, done) => {
    try {
        // Check if user already exists in our own db
        const currentUser = await userModel.findOne({ accountId: profile.id, provider: profile.provider });
        if (currentUser) {
            // User already exists, return the user
            console.log('User is: ', currentUser);
            done(null, currentUser);
        } else {
            // User does not exist, create a new user
            const newUser = await userModel.create({
                accountId: profile.id,
                name: profile.displayName,
                profileImage: profile.photos[0].value, // Assuming the first photo is the profile picture
                provider: profile.provider,
                email: profile.emails ? profile.emails[0].value : null, // Check if emails are provided
            });
            console.log('Created new user: ', newUser);
            done(null, newUser);
        }
    } catch (error) {
        console.error('Error during Facebook authentication: ', error);
        done(error, null);
    }
}));




