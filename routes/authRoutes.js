const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = express.Router()
const User = require("../models/userModels")

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body

    try{
        const doesUsernameExist = await User.findOne({ username})
        const doesEmailExist = await User.findOne({ email})

        let errors = []

        if (doesUsernameExist){
            errors.push("username")
        }
        if (doesEmailExist){
            errors.push("email")
        }

        //if array has something then prints out what is in it
        if(errors.length > 0){
            return res.status(400).json({
                message: `${errors.join(" and ")} ${errors.length > 1 ? "already exist" : "already exists"}`
            })
        }

        //now we create new user and add to db
        const newUser = await User.create({
            username,
            email,
            password
        })

        //jwt payload, we dont add any password as we dont have the jwt info to have password
        const jwtPayload = {
            id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role
        }

        //create token with payload
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        return res.status(201).json({
            message: `User ${newUser.username}, successfully created`,
            token,
            user:{
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })

    }
    catch(error){
        console.error("Issue signing up", error.message)
        return res.status(500).json({ message: error.message})
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.findOne({email})
        
        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        const comparedPassword = await bcrypt.compare(password, user.password)
        if (!comparedPassword){
            return res.status(400).json({message: "Password is incorrect"})

        }

        //payload, data that is going into the jwt
        const jwtPayload = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        }

        //gen token, .sign, signs the token with the jwt secret
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        return res.status(200).json({
            message: "Login Successful",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    }
    catch(error){
        console.error("Login error", error.message)
        return res.status(500).json({message: "Server error"})
    }
})

module.exports = router