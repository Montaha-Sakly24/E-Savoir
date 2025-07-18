import express from "express";
import multer from 'multer'
import upload from '../middlewares/upload.js';
import { createArticle, submitArticle, getOne, getPublishedArticles, getMyArticles, editArticle, deleteArticle, approveArticle, rejectArticle } from "../controllers/articleController.js";
import authenticate from "../middlewares/authMiddleware.js";
//import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/add",  upload.single("coverImage"), authenticate, createArticle);
router.post("/:id/submit",  authenticate, submitArticle);
router.get("/:id",  getOne);
router.get("/list", getPublishedArticles);
router.get("/mylist", getMyArticles);
router.put("/:id", upload.single("coverImage"), editArticle);
router.delete("/:id", deleteArticle);

//approbation admin
router.put("/:id/approve",  authenticate, approveArticle);
router.put("/:id/reject",  authenticate, rejectArticle);


export default router;