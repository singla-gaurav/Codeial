const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");

// set up passport google strategy
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_url
    },

    function(accessToken, refreshToken, profile, done){
        // find the user 
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log("Error in Google Strategy", err); return;}

            if (user){
                // if found, log user in
                return done(null, user);
            }else{
                // if not found, create new user and log user in
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString("hex")
                }, function(err, user){
                    if (err){console.log("error in creating user", err); return;}

                    return done(null, user)
                })
            }
        })
    }
))