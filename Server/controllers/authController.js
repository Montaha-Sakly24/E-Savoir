import {User,ROLES} from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
        const {firstname,lastname, email, password} = req.body;
        const user = await User.findOne ({email});
        if (user){
            return res.status(401).json({success: false, message: "User already exist"})
        }

        const hashPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            firstname,lastname,email,password: hashPassword, role: ROLES.MEMBER
        })

        await newUser.save();

        return res.status(200).json({success:true, message:"Accounted created successfully"});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in adding user "});

    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne ({email});
        if (!user){
            return res.status(401).json({success: false, message: "User not exist"})
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword){
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "5h"});  

        let redirectPath = '';
        switch(user.role.toLowerCase()) {
            case 'admin':
                redirectPath = '/admin';
                break;
            case 'member':
                redirectPath = '/member';
                break;
            default:
                redirectPath = '/';
        }

        return res.status(200).json({success:true,token, redirectTo: redirectPath, user: {firstname: user.firstname, role: user.role}, message:"Login successfully"});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in login server "});

    }
  
};

