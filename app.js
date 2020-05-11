const path = require('path')

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();

//passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//EJS
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes

app.use('/', require('./routes/index'));
app.use('/org', require('./routes/organization'));
app.use((req, res, next) => {
    res.render('404');
})


//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    })