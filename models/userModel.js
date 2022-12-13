const mongoose = require('mongoose');

//Creating Schema using mongoose
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:[4]
    },
    RefreshToken:{
        type:String
    },
    isActivated:{
        type:Boolean,
        default: false
    },
})

//Creating models
const userModel = mongoose.model('user',userSchema);
module.exports = userModel;