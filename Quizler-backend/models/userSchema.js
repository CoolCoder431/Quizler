const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userCare = new mongoose.Schema({
    name :{type: String},
    password : {type : String , required:true},
    email : {type : String , unique:true , required:true}
})

userCare.pre('save' , async function (next){

    this.password = await bcrypt.hash(this.password , 10);
    next();
})

module.exports = mongoose.model("User" , userCare);