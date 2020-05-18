const path = require('path');
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'donatefoodonline@gmail.com',
        pass: 'donate123'
    }
});


const bcrypt = require('bcryptjs');
const passport = require('passport')

const Donars = require('../modal/Donars');
const Organizations = require('../modal/Organization');
const Emails = require('../modal/emails');

module.exports.getRegister = (req, res, next) => {
    res.render('registerorg')
}

module.exports.getLogin = (req, res, next) => {
    res.render('loginorg')
}

module.exports.postRegister = (req, res, next) => {
    const { organizationName, organizationEmail, password, password2, organizationPincode, organizationAddress, organizationContact } = req.body;
    let errors = [];
    if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
    }

    if (errors.length > 0) {
        res.render('registerorg', {
            errors,
            organizationName,
            organizationEmail,
            organizationAddress,
            organizationPincode,
            organizationContact
        });
    } else {
        Organizations.findOne({ organizationEmail: organizationEmail })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already exists' });
                    res.render('registerorg', {
                        errors,
                        organizationName,
                        organizationEmail,
                        organizationAddress,
                        organizationPincode,
                        organizationContact
                    });
                } else {
                    const newOrganization = new Organizations({ organizationName, organizationEmail, organizationContact, organizationPincode, organizationAddress, password });
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newOrganization.password, salt, (err, hash) => {
                        if (err) throw err;
                        newOrganization.password = hash;
                        newOrganization.save()
                            .then(user => {
                                const verify = user.verificationKey;
                                ejs.renderFile(path.join(path.dirname(process.mainModule.filename), 'views', 'emails', 'verify.ejs'), { verify }, function(err, data) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        const mainOptions = {
                                            from: 'donatefoodonline@gmail.com',
                                            to: organizationEmail,
                                            subject: 'Verify your email',
                                            html: data
                                        };
                                        transporter.sendMail(mainOptions, function(err, info) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                const sentEmails = new Emails({ organizationEmail })
                                                sentEmails.save()
                                            }
                                        });
                                    }
                                })
                                req.flash('error_msg', 'Please verify your email to login');
                                res.redirect('/org/login');
                            }).catch(err => {
                                const error = new Error(err);
                                error.httpStatusCode = 500;
                                return next(error);
                            })
                    }))
                }
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }
}
module.exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/org/dashboard',
        failureRedirect: '/org/login',
        failureFlash: true
    })(req, res, next);
}

module.exports.getVerifyEmail = (req, res, next) => {
    const key = req.params.key;
    Organizations.findOne({ verificationKey: key, isVerified: false })
        .then(org => {
            if (org) {
                org.isVerified = true;
                org.save()
                    .then(() => {
                        req.flash('success_msg', 'You are now verified you may login');
                        res.redirect('/org/login')
                    })
            } else {
                req.flash('error_msg', 'You are already verified');
                res.redirect('/org/login')
            }
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

module.exports.getForgotPassword = (req, res, next) => {
    res.render('forgot-password');
}

module.exports.postForgotPassword = (req, res, next) => {
    const organizationEmail = req.body.organizationEmail;
    Organizations.findOne({ organizationEmail: organizationEmail })
        .then((user) => {
            if (user) {
                const verify = user.verificationKey;
                ejs.renderFile(path.join(path.dirname(process.mainModule.filename), 'views', 'emails', 'forgot.ejs'), { verify }, function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(user.organizationEmail)
                        const mainOptions = {
                            from: 'donatefoodonline@gmail.com',
                            to: user.organizationEmail,
                            subject: 'Reset your Password',
                            html: data
                        };
                        transporter.sendMail(mainOptions, function(err, info) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("sent")
                            }
                        });
                    }
                })
                req.flash('error_msg', 'We have sent you an email reset using the link');
                res.redirect('/org/login')
            } else {
                req.flash('error_msg', 'Invalid Email Address');
                res.redirect('/org/login')
            }
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

module.exports.getUpdatePassword = (req, res, next) => {
    res.render('Update-Password', { key: req.params.key });
}

module.exports.postUpdatePassword = (req, res, next) => {
    const { password, password2, key } = req.body;
    let errors = [];
    if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
    }
    if (errors.length > 0) {
        res.render('Update-Password', {
            errors,
            key
        });
    } else {
        Organizations.findOne({ verificationKey: key })
            .then(user => {
                if (user) {
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user.save()
                            .then(use => {
                                req.flash('success_msg', 'Password Changed');
                                res.redirect('/org/login');
                            }).catch(err => {
                                const error = new Error(err);
                                error.httpStatusCode = 500;
                                return next(error);
                            })
                    }))
                }
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }
}

module.exports.getDashboard = (req, res, next) => {
    const organizationName = req.user.organizationName;
    const organizationEmail = req.user.organizationEmail;
    Donars.find({ organizationName: organizationName, organizationEmail: organizationEmail }).sort({ originalDate: 'desc', units: 'desc' })
        .then(donations => {
            res.render('dashboard', {
                donars: donations,
                name: req.user.organizationName
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

module.exports.getDonate = (req, res, next) => {
    res.render('register-donar')
}

module.exports.postDonate = async(req, res) => {
    const captchaVerified = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=6LcWxfQUAAAAACtjKYUZDUDjzFwxz4Z038-BJgbr&response=${req.params.captcharesponse}`, {
            method: "POST"
        })
        .then(_res => _res.json())

    if (captchaVerified.success === true) {
        const { units, originalDate, distributionPincode, slot, distributionPlaces } = req.params;
        const { organizationName, organizationEmail, organizationContact } = req.user;
        const distributionDate = originalDate.substring(8) + '-' + originalDate.substring(5, 7) + '-' + originalDate.substring(0, 4);
        const newDonar = new Donars({ organizationName, organizationEmail, organizationContact, units, distributionDate, distributionPincode, slot, distributionPlaces, originalDate })
        newDonar.save().then(() => {
            res.end()
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    }
}

module.exports.getLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}