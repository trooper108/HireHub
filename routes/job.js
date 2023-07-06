const express =  require('express');
const router = express.Router();

const jobsModel = require('../models/jobs');
const User = require('../models/users');

//  ! middle Ware

const {checkAdmin,checkLoggedin} = require('../middlewares/index');

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,'\\$&');
}

router.get('/',(req,res)=>{
    res.send('Hello World ');
})


// index

router.get('/jobs', async (req,res)=>{
    try {
        req.flash('success');
        req.flash('error');
        console.log('index page');
        const jobs = await jobsModel.find();
        res.render('jobs/index',{jobs}); 
    } catch (error) {
        req.flash('error','wrong');
        res.redirect('/');
    }
});

// search

router.get('/jobs/search',async(req,res)=>{
    try {
        const name = req.query.name;
        if(!name) return res.redirect('/jobs');
        const regex = new RegExp(escapeRegex(name))
        const jobs = await jobsModel.find({companyName : regex});
        res.render('jobs/index',{jobs});
    } catch (error) {
        req.flash('error','wrong');
        console.log(error);
        res.redirect('/');
    }
})
// new
router.get('/jobs/new',checkLoggedin,checkAdmin,(req,res)=>{
    res.render('jobs/new');
});
// create
router.post('/jobs',checkLoggedin,checkAdmin,async (req,res)=>{
    try {
        const jobData = new jobsModel({
            postName : req.body.postName,
            companyName : req.body.companyName,
            ctc : req.body.ctc,
            cgpa : req.body.cgpa,
            location : req.body.location,
            description : req.body.description,
            numberOfPosition : req.body.numberOfPosition,
        });
        await jobData.save();
        res.redirect('/jobs');
    } catch (error) {
        res.send(error);
    }
});
// show
router.get('/jobs/:id',checkLoggedin,async (req,res)=>{
    try {
        console.log('show page');
        const job = await jobsModel.findById(req.params.id);
        req.flash('success','show done')
        res.render('jobs/show',{job});
    } catch (error) {
        req.flash('error','wrong');
        res.redirect('/jobs');
    }
});
// edit
router.get('/jobs/:id/edit',checkLoggedin,checkAdmin, async (req,res)=>{
    try {
        console.log('Edit API');
        const job = await jobsModel.findById(req.params.id);
        res.render('jobs/edit',{job});
        
    } catch (error) {
        res.send(error);
    }
});
// update
router.patch('/jobs/:id',checkLoggedin,checkAdmin,async (req,res)=>{
    try {
        console.log('update API');
        const data = {
            postName : req.body.postName,
            companyName : req.body.companyName,
            ctc : req.body.ctc,
            cgpa : req.body.cgpa,
            location : req.body.location,
            description : req.body.description,
            numberOfPosition : req.body.numberOfPosition,
        };
        await jobsModel.findByIdAndUpdate(req.params.id, data);
        req.flash('success','update');
        res.redirect('/jobs');
    } catch (error) {

        req.flash('error','wrong')
        res.redirect('/jobs');
    }
});
// delete
router.delete('/jobs/:id',checkLoggedin,checkAdmin, async (req,res)=>{
    try {
        console.log('Delete API');
        await jobsModel.findByIdAndDelete(req.params.id);
        res.redirect('/jobs');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// Changing Job Status

router.get('/jobs/:id/status',checkLoggedin,checkAdmin, async (req,res)=>{
    try {
        const {type} = req.query, {id} = req.params;
        if(!type) req.redirect('/jobs');
        await jobsModel.findByIdAndUpdate(id,{status : type});
        res.redirect('/jobs');
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

// apply in jobs

router.get('/jobs/:id/apply/:userId',async(req,res)=>{
    try {
        const {id,userId} = req.params;
        const job = await jobsModel.findById(id);
        const user = await User.findById(userId);
        if(user.cgpa < job.cgpa){
            req.flash('error', `your cgpa ${user.cgpa} is lower`);
            return res.redirect(`/jobs/${id}`);
        }
        for(let ids of job.appliedUser){
            if(ids.equals(user._id)){
                req.flash('error', 'you are already applied on this job')
                return res.redirect(`/jobs/${id}`);
            }
        }
        
        job.appliedUser.push(user);
        await job.save();
        res.redirect(`/jobs/${id}`);
        
    } catch (error) {
        req.flash('error','somthing gone Wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});

router.get('/jobs/:id/test',checkLoggedin, async(req,res)=>{
    try {
        const job = await jobsModel.findById(req.params.id);
        let flag = false;
        job.appliedUser.forEach((ele) => {
            if(ele.equals(req.user._id)){
                flag = true;
            }
        });

        if(!flag){
            req.flash('error','somthing11 are wrong');
            return res.redirect(`/jobs/${req.params.id}`);
        }
        res.render('jobs/test',{job});
    } catch (error) {
        req.flash('error','sonmthing is wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});
router.post('/jobs/:id/test',checkLoggedin,async(req,res)=>{
    try {
        const job = await jobsModel.findById(req.params.id);
        const question = job.questions;
        let marks = 0,correct =0,wrong =0;
        let flag = false;
        job.appliedUser.forEach((ele) => {
            if(ele.equals(req.user._id)){
                flag = true;
            }
        });

        if(!flag){
            req.flash('error','somthing are wrong');
            console.log(error);
            return res.redirect(`/jobs/${req.params.id}`);
        }
        // res.send(req.body)
        for(let idx in question){
            let ques = question[idx];
            let ans = req.body[`question${idx}`];
            if(ques.correctAnswer === ans){
                marks += 4;
                correct++;
            }
            else{
                marks--;
                wrong++;
            }
        }
        res.json({
            marks,correct,wrong
        })
    } catch (error) {
        req.flash('error','sonmthing is wrong');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
});

module.exports = router;
