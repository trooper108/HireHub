const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Resume = require('../models/resume');

// CRUD
// show edit update 

//  ! middle Ware

const {checkLoggedin,verifyUser} = require('../middlewares/index');

// show

router.get('/user',(req,res)=>{
    res.send('user');
})

router.get('/user/:id',checkLoggedin,async(req,res)=>{
    try {
        const {id} = req.params;
        const foundUser = await User.findById(id);
        res.render('users/show',{foundUser});

    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// edit

router.get('/user/:id/edit',checkLoggedin,verifyUser, async(req,res)=>{
    try {
        const foundUser = await User.findById(req.params.id);
        res.render('users/edit',{foundUser});
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.patch('/user/:id',checkLoggedin,verifyUser,async (req,res)=>{
    try {
        const { id }  = req.params;
        const foundUser = {
            dob : req.body.dob,
            phone :req.body.phone,
            gender : req.body.gender,
            cgpa : req.body.cgpa
        }
        await User.findByIdAndUpdate(id,foundUser);
        res.redirect(`/user/${id}`)
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// resume

router.get('/user/:id/resume',async(req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.render('users/resume_edit',{user});
    } catch (error) {
        req.flash('error','something gone wrong');
        res.redirect(`/user${id}`);
    }
})

router.post('/user/:id/resume',async(req,res)=>{
    try {
        const resume = new Resume({...req.body});
        await resume.save();
        const user = await User.findById(req.params.id);
        user.resume = resume;
        await user.save();
        res.redirect(`/user/${req.params.id}`);
    } catch (error) {
        req.flash('error','somthing gone wrong');
        console.log(error);
        res.redirect()
    }
})


module.exports = router;