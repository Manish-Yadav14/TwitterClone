const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    msg:{
        type:String,
        required:true,
    }
})

module.exports= mongoose.model('tweet',tweetSchema);