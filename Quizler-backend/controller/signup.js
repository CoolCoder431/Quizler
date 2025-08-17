const User = require('../Model/userSchema.js');

async function SignUp(req,res){
    const {name , password , email} = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser) return res.send("User already exists");
    if(!email || !password || !name) return res.send("Something is invalid");

    const user = new User({name , email,password});
    await user.save();

    res.status(201).json({message : " User created succesfully"});
}

module.exports = SignUp;
