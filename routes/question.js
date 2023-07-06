const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');

// index
router.get('/jobs/:id/questions',async(req,res)=>{
    try {
        let count = 0;
        const job = await Job.findById(req.params.id);
        res.render('questions/index',{job,count});
    } catch (error) {
        req.flash('error','somthing are wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});
// new
router.get('/jobs/:id/questions/new',async(req,res)=>{
    try {
        const job = await Job.findById(req.params.id);
        res.render('questions/new',{id:req.params.id});
    } catch (error) {
        req.flash('error','somthing are wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});
// create
router.post('/jobs/:id/questions',async(req,res)=>{
    try {
        const ques = {
            title : req.body.title,
            options1 : req.body.options1,
            options2 : req.body.options2,
            options3 : req.body.options3,
            options4 : req.body.options3,
            correctAnswer : req.body.correctAnswer,
        }
        const job = await Job.findById(req.params.id);
        job.questions.push(ques);
        await job.save();
        res.redirect(`/jobs/${req.params.id}/questions`);
    } catch (error) {
        req.flash('error','somthing are wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});
// edit
router.get('/jobs/:id/questions/:idx/edit',async(req,res)=>{
    try {
       const job = await Job.findById(req.params.id);
       if(req.params.idx >= job.questions.length){
            req.flash('error','questions are not present in that idx');
            return res.redirect(`/jobs/${req.params.id}/questions`);
       }
       const ques = job.questions[req.params.idx];
       res.render('questions/edit',{ques,idx:req.params.idx,id:req.params.id});
    } catch (error) {
        req.flash('error','somthing are wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});
// update
router.patch('/jobs/:id/questions/:idx',async(req,res)=>{
    try {
        const ques = {
            title : req.body.title,
            options1 : req.body.options1,
            options2 : req.body.options2,
            options3 : req.body.options3,
            options4 : req.body.options3,
            correctAnswer : req.body.correctAnswer,
        }
        const job = await Job.findById(req.params.id);
        if(req.params.idx >= job.questions.length){
            req.flash('error','questions are not present in that idx');
            return res.redirect(`/jobs/${req.params.id}/questions`);
       }
        job.questions[req.params.idx] = ques;
        await job.save();
        res.redirect(`/jobs/${req.params.id}/questions`,job);
    } catch (error) {
        req.flash('error','somthing are wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});
// delete
router.delete('/jobs/:id/questions/:idx',async(req,res)=>{
    try {
        const job = await Job.findById(req.params.id);
        job.questions.splice(req.params.idx,1);
        await job.save();
        res.redirect(`/jobs/${req.params.id}/questions`);
    } catch (error) {
        req.flash('error','somthing are wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});

module.exports = router;