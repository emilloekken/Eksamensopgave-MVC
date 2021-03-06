const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//henter vores user model
const User = require('../model/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
// matcher vores user
            User.findOne({ email: email})
            .then(user => {
                if(!user) {
                    return done(null, false, { message: 'Emailen er ikke registreret'});
                }

//Match password for user
                bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password er ikke korrekt'})
                }
                });
            })
            .catch(err => console.log(err))
        })
    );

    //user id bliver gemt i en session, så vi kan forblive logget ind, og ved hvilke id vi skal logge ud med senere hen 
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
    
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}