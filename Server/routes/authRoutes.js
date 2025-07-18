import express from "express";
import { signup, login } from "../controllers/authController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get('/verify',authenticate, async (req, res) => {
    return res.status(200).json({success:true, user: req.user});
})

export default router;