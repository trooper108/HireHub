const mongoose = require('mongoose');
const notifySchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    body : String,
    author : String,
});

module.exports = mongoose.model('notifications',notifySchema);
