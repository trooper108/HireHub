const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    postName : {
        type : String,
        required : true,
        default : 'SDE',
    },
    companyName : {
        type : String,
        required : true,
        default : "Name not given",
    },
    ctc : {
        type : Number,
        required : true,
    },
    cgpa : {
        type : Number,
        required : true,
        min : 0,
        max : [10,'Maximun allowed value for cgpa is 10'],
    },
    location : String,
    description : String,
    numberOfPosition : Number,
    status : {
        type : String,
        enum :['active','over','interview'],
        default : 'active'
    },
    appliedUser:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
        }
    ],
    questions :[
        {
            title : String,
            options1 : String,
            options2 : String,
            options3 : String,
            options4 : String,
            correctAnswer : String,
        }
    ],
});

module.exports = mongoose.model('job',jobSchema);