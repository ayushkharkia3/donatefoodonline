const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User modal
const Organization = require('../modal/Organization');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'organizationEmail' }, (organizationEmail, password, done) => {
            //Match user
            Organization.findOne({ organizationEmail: organizationEmail, isVerified: true })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered or verified' });
                    }
                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Password Incorrect" });
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
    passport.deserializeUser((id, done) => {
        Organization.findById(id, (err, user) => {
            done(err, user)
        })
    });
}