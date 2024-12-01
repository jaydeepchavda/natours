const mongoose = require('mongoose');
const validator = require('validatore');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please tell us your name'],
        unique:true,
        trim:true,
        minLength:[3, "A user name must have more then 3 characters"],
        maxLength:[12, "A user name must have less then 12 characters"]
    },
    email:{
        type:String,
        required:[true, 'please provide your email'],
        unique: true,
        lowercase:true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    photo : String,
    password:{
        type:String,
        required:[true, 'please provide a password'],
        minLength:[8, "password must be more then 8 characters"]
    },
    passwordConfirm: {
        type:String,
        required:[true,'please confirm your password']
    }
});


const User = mongoose.model("User", userSchema);

module.exports = User;