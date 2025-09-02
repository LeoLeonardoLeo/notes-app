const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
})


//hashing password on mongoose
userSchema.pre('save', async function(next){


    //this hashes only if the password is new or changed
    //wont matter much unless the user wants to change email or username, so this
    //prevents the password from being hashed again
    if (!this.isModified('password')){
        return next()
    }

    const hashedPassword =  await bcrypt.hash(this.password, 10)
    this.password = hashedPassword

    next()
})

module.exports = mongoose.model("user", userSchema)