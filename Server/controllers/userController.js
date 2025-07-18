import {User, ROLES} from "../models/User.js";


//profile management

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById( req.user.id);

        if (!user) {
           return res.status(404).json({ success: false, message: "Profile not found" });
        }
        
        return res.status(200).json({success:true, user});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in fetching profile"});

    }
}

export const updateMyProfile = async (req, res) => {
    try {
        const updateProfile = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });

        if (!updateProfile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({success:true, updateProfile});

    } catch (error) {
        return res.status(500).json({success:false, message:"Error in editing Profile "});
    }
}

export const deleteMyProfile = async (req, res) => {
    try {
        const deleteProfile = await User.findByIdAndDelete(req.user.id);

        if (!deleteProfile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({success:true, deleteProfile});

    } catch (error) {
        return res.status(500).json({success:false, message:"Error in deleting Profile"});

    }
}


//member account management

export const getOne = async (req, res) => {
    try {
        const { id } =req.params;
        const member = await User.findOne({ _id: id, role: ROLES.MEMBER });

        if (!member) {
           return res.status(404).json({ success: false, message: "Member not found" });
        }
        
        return res.status(200).json({success:true, member});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in fetching member"});

    }
}

export const getAllMembers = async (req, res) => {
    try {
        const members = await User.find({ role: ROLES.MEMBER });
        return res.status(200).json({success:true, members});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in fetching members "});

    }
}

export const deleteMember = async (req, res) => {
    try {
        const {id} = req.params;
        const deleteMember = await User.findByIdAndDelete(id);

        if (!deleteMember) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        return res.status(200).json({success:true, deleteMember});

    } catch (error) {
        return res.status(500).json({success:false, message:"Error in deleting member "});

    }
}
