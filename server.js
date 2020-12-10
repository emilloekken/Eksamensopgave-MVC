const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyparser = require('body-parser')

const app = express();

//Passport konfiguration
require('./authentication/compare')(passport);


//DB konfiguration
const db = require('./authentication/db').MongoURI;

//connecter til Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Databasen er flyvende'))
.catch(err => console.log(err));

//EJS 
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

app.use(bodyparser.json())

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware som bruges til holde os som brugere logget ind på siden, indtil vi logger ud igen
app.use(passport.initialize());
app.use(passport.session());

//connect flash 
app.use(flash());

//indsætter flash messages, pop up beskeder som viser sig, hvis arbejder på req,res. Den svarer på parametrene success eller error. 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//routes til loginController og userController
app.use('/', require('./controller/loginController'));
app.use('/users', require('./controller/userController'));

//Routes til Matches, swipe og profil
app.use('/home', require('./controller/home'));

//opsætter server på port 5050

const PORT = process.env.PORT || 5050;

app.listen(PORT, console.log(`Server kører på port ${PORT}`));