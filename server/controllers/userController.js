import User from "../models/User.js";
import bcrypt from 'bcrypt'
import { request } from "express";
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";


const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}


// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // check it required field are present
        if(!name || !email || !password){
            return res.status(400).json({message: 'missing required field'})
        }

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'user already exists'})
        }

        // create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        // return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({message: 'User created successfully', token, user: newUser})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


// controller for user login
// POST: /api/users/login

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;


        // check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        //check id password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid password'})
        }


       
        // return success message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({message: 'Login successful', token, user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


// controller for getting user by id
// POST: /api/users/data

export const getUserById = async (req, res) => {
    try {
        
        const userId = req.userId;

        //check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'user not found'})
        }

        //return user
        user.password = undefined

        return res.status(200).json({message: 'Login successful', user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user resume
// GET: /api/users/resumes

export const getUserResume = async (req, res) => {
    try {
        
        const userId = req.userId;

        // return user resume
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}