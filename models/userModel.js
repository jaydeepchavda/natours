const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

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
    role:{
        type:String,
        enum:['user','guide','led-guide','admin'],
        default:'user'
    },
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires:Date
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
userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next(); 

    this.passwordChangedAt = Date.now() - 1000;
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

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 + 60 + 1000;

    return resetToken;
}
const User = mongoose.model("User", userSchema);

module.exports = User;