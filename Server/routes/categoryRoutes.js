import express from "express";
import { createCategory, getOne, getAllCategories, editCategory, deleteCategory } from "../controllers/categoryController.js";
import authenticate from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";


const router = express.Router();

router.post("/add", authenticate, requireAdmin,  createCategory);
router.get("/list", authenticate, getAllCategories);
router.get("/:id", authenticate,  getOne);
router.put("/:id", authenticate, requireAdmin, editCategory);
router.delete("/:id", authenticate, requireAdmin, deleteCategory);


export default router;