const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/users');


router.get('/signup', (req, res) => {
    res.render('users/signup');
});


router.post('/signup', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        dob: req.body.dob,
        phone: req.body.phone,
        gender: req.body.gender,
        cgpa: req.body.cgpa
    });

    let registeredUser = await User.register(newUser, req.body.password);
    req.login(registeredUser, function (error) {
        if (error) res.send(error);
        res.redirect('/jobs');
    })
});



router.get('/login', (req, res) => {
    res.render('users/login');
});


router.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login' }), 
    (req, res) => {
        res.redirect('/jobs');
    }
);


router.get('/logout', (req, res) => {
    req.logout(function (error) {
        if (error) res.send(error);
        res.redirect('/jobs');
    })
})

module.exports = router;