const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

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
        minLength:[8, "password must be more then 8 characters"],
        select:false
    },
    passwordConfirm: {
        type:String,
        required:[true,'please confirm your password'],
        validate : {
            //this only works on create and save method
            validator: function(el){
                return el === this.password;
            },
             message: "password are not the same !!"
        }
       
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next){
    // only runs this function if password actually was modified
    if(!this.isModified('password')) return next();
    
    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // delete the passwordConfirm field
    this.passwordConfirm = undefined
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword) { 
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        // console.log(this.passwordChangedAt, JWTTimestamp);
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10 );

        console.log(changedTimeStamp , JWTTimestamp);

        return JWTTimestamp < changedTimeStamp // 300 < 200
    }
    return false;
}
const User = mongoose.model("User", userSchema);

module.exports = User;