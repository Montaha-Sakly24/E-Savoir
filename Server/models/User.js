import mongoose from "mongoose";

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
};

const userSchema = new mongoose.Schema({
    firstname: { type: String, required:true, trim: true },
    lastname: { type: String, required:true, trim: true },
    email: { type:String, required:true, unique:true, trim: true },
    password: { type:String, required:true},
    role: { type:String, enum: Object.values(ROLES), 
        default: ROLES.MEMBER  },
},{
    timestamps: true,
});

export const User = mongoose.model("User", userSchema);
