import {User, ROLES} from "../models/User.js";
import Article from "../models/Article.js";
import bcrypt from 'bcrypt';

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

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ success: false, message: "Error changing password" });
  }
};

export const deleteMyProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const deleteProfile = await User.findByIdAndDelete(userId);

        if (!deleteProfile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }
        await Article.deleteMany({ userId: userId });

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
        await Article.deleteMany({ userId: id });

        return res.status(200).json({success:true, message: "Member and related articles deleted successfully", deleteMember});

    } catch (error) {
        return res.status(500).json({success:false, message:"Error in deleting member "});

    }
}
