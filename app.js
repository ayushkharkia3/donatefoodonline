const path = require('path')

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const csrf = require('csurf');
const session = require('express-session');
const passport = require('passport');


const app = express();
const csrfProtection = csrf();

require('./config/passport')(passport);

const db = require('./config/keys').MongoURI;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', require('./routes/index'));
app.use('/org', require('./routes/organization'));
app.get('/500', (req, res, next) => {
    res.status(500).render('500');
});
app.use((req, res, next) => {
    res.render('404');
})


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 3000,()=>{
            console.log("Server running");
        });
    })
    .catch(err => {
        throw new Error(err);
    })
