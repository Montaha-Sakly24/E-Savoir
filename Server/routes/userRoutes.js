import express from "express";
import { getOne, getAllMembers, deleteMember , getMyProfile, updateMyProfile, deleteMyProfile } from "../controllers/userController.js";
import authenticate from '../middlewares/authMiddleware.js';
import { requireAdmin } from "../middlewares/roleMiddleware.js";


const router = express.Router();

//profile management
router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, updateMyProfile);
router.delete("/me", authenticate, deleteMyProfile);


//member account management
router.get("/:id", authenticate, getOne);
router.get("/list", authenticate, requireAdmin, getAllMembers);
router.delete("/:id", authenticate, requireAdmin, deleteMember);

export default router;