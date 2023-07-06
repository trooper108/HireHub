const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const app = express();

// ! DB SetUp

mongoose
    .connect('mongodb+srv://trooper:trooper@cluster0.hubyr3p.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('db connected');
    })
    .catch((err) => {
        console.log(err);
    });

const User = require('./models/users');


// ! Session SetUp

app.use(
    session({
        secret: '7A339D1E1C559B3B27E81553149FD',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            // secure : true
            maxAge: 1000 * 60 * 60 * 24 * 2,
        }
    })
)


// Passport SetUp

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ! Server SetUp

// connect flash

app.use(flash());
// serving static files
app.use(express.static(path.join(__dirname, 'public')));
// form parsing
app.use(express.urlencoded({ extended: true }));

// remove Ejs Extension
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));


// glbal middleware

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

const jobRoutes = require('./routes/job');
const authRoutes = require('./routes/auth');
const userRoute = require('./routes/users');
const questionRoute = require('./routes/question');
app.use(authRoutes);
app.use(jobRoutes);
app.use(userRoute);
app.use(questionRoute);




// const jobs = require('./models/jobs');
// app.use(jobs);

app.listen(8000, () => {
    console.log('Server is running on port number 8000');
})