import mongoose from "mongoose";

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
};

const userSchema = new mongoose.Schema({
    numericId: {
        type: Number,
        unique: true,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        } 
    },
    firstname: { type: String, required:true, trim: true },
    lastname: { type: String, required:true, trim: true },
    email: { type:String, required:true, unique:true, trim: true, match: [/^[\w.-]+@gmail\.com$/, 'Email must be a valid Gmail address (e.g. example@gmail.com)'] },
    password: { type:String, required:true, minlength: [8, 'Password must be at least 8 characters long']},
    education: { type: String, required:true, trim: true },  
    work: { type: String, required:true, trim: true },     
    address: { type: String, required:true, trim: true },   
     role: { 
      type: String, 
      enum: Object.values(ROLES), 
      default: ROLES.MEMBER 
    },
},{
    timestamps: true,
});

export const User = mongoose.model("User", userSchema);
