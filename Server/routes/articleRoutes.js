import express from "express";
import multer from 'multer'
import upload from '../middlewares/upload.js';
import { createArticle, submitArticle, getOne, getAllArticles, getPublishedArticles, getMyArticles, editArticle, deleteArticle, approveArticle, rejectArticle } from "../controllers/articleController.js";
import authenticate from "../middlewares/authMiddleware.js";
//import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/add",  upload.single("coverImage"), authenticate, createArticle);
router.get("/list", authenticate, getAllArticles);
router.get("/publishedlist", authenticate, getPublishedArticles);
router.get("/mylist", authenticate, getMyArticles);

router.post("/:id/submit",  authenticate, submitArticle);
router.get("/:id",  getOne);
router.put("/:id", upload.single("coverImage"), authenticate, editArticle);
router.delete("/:id", authenticate, deleteArticle);

//approbation admin
router.put("/:id/approve",  authenticate, approveArticle);
router.put("/:id/reject",  authenticate, rejectArticle);


export default router;