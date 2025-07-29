import Article from "../models/Article.js";

export const createArticle = async (req, res) => {
    try {
        const { title, content, tags, categoryId } = req.body;

        if (!title || !content || !categoryId) {
            return res.status(400).json({ success: false, message: "Title, content, and categoryId are required." });
        }

        // Parse tags if needed
        let parsedTags = [];
        try {
            if (tags) {
                parsedTags = JSON.parse(tags); // convert from string to array
            }
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid tags format. Must be JSON array." });
        }

        const lastArticle = await Article.findOne().sort({ numericId: -1 });
        const nextId = lastArticle ? lastArticle.numericId + 1 : 1;

        const newArticle = new Article({
            title,
            content,
            tags: parsedTags,
            coverImage: req.file?.filename,
            categoryId,
            userId: req.user.id,
            numericId: nextId
        });

        await newArticle.save();

        return res.status(200).json({ success: true, newArticle });

    } catch (error) {
        console.error('POST /api/Article error:', error);
        return res.status(500).json({ success: false, message: "Error in adding Article " });
    }
};


export const submitArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id });

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }
    
    //console.log("Article userId:", article.userId.toString());
    //console.log("Request userId:", req.user.id.toString());

    if (!article.userId.equals(req.user.id)) {
        return res.status(403).json({ success: false, message: "You are not authorized to submit this article." });
    }


    if (!['draft', 'amended'].includes(article.status)) {
      return res.status(400).json({ success: false, message: `You can only submit an article that is in draft or amended status. Current status: ${article.status}` });
    }

    article.status = 'pending';
    article.submittedAt = new Date();

    await article.save();

    res.status(200).json({ success: true, message: "Article submitted for validation", article });
  } catch (error) {
    console.error("submitArticle error:", error);
    res.status(500).json({ success: false, message: "Error while submitting" });
  }
};

export const getOne = async (req, res) => {
    try {
        const { id } =req.params;
        const article = await Article.findById(id)
          .populate('categoryId', 'title')
          .populate('userId', 'firstname lastname');

        if (!article) {
           return res.status(404).json({ success: false, message: "Article not found" });
        }
        
        return res.status(200).json({success:true, article});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in fetching Article"});

    }
}

export const getPublishedArticles = async (req, res) => {
    try {
        const articles = await Article.find({ status: "published" })
          .populate('categoryId', 'title')
          .populate('userId', 'firstname lastname');

        return res.status(200).json({success:true, articles});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in fetching Articles "});

    }
}

export const getAllArticles = async (_, res) => {
    try {
        const articles  = await Article.find()
        .populate('categoryId', 'title') 
        .populate('userId', 'firstname lastname') 
        .sort({ createdAt: -1 });
        
        if (!articles || articles.length === 0) {
            return res.status(404).json({ success: false, message: "No articles found" });
        }
        return res.status(200).json({ success: true, articles });
    } catch (error) {
                return res.status(500).json({ success: false, message: "Error in fetching articles" });
    }
}


export const getMyArticles = async (req, res) => {
  console.log("USER:", req.user);
    try {
        const articles = await Article.find({userId: req.user.id})
          .populate('categoryId', 'title')
          .populate('userId', 'firstname lastname');
          
        return res.status(200).json({success:true, articles});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in fetching articles "});

    }
}

export const editArticle = async (req, res) => {
    const articleId = req.params.id;
    const updatedFields = { ...req.body };

    // Parse tags if provided
    if (updatedFields.tags) {
        try {
            updatedFields.tags = JSON.parse(updatedFields.tags);
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid tags format. Must be JSON array." });
        }
    }

    // Handle new cover image
    if (req.file?.filename) {
        updatedFields.coverImage = req.file.filename;
    }

    try {
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        if (!article.userId.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this article." });
        }

        if (article.status === 'published') {
            article.pendingUpdate = { ...updatedFields, updatedAt: new Date() };
            article.hasPendingUpdate = true;
            await article.save();

            return res.status(200).json({ success: true, message: "Change saved. Pending validation.", article });
        }

        if (article.status === 'rejected') {
            article.status = 'amended';
        }

        Object.assign(article, updatedFields);
        const updatedArticle = await article.save();

        return res.status(200).json({ success: true, article: updatedArticle });

    } catch (error) {
        console.error("Error editing article:", error);
        return res.status(500).json({ success: false, message: "Error in editing Article" });
    }
};


export const deleteArticle = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedArticle = await Article.findById(id);

        if (!deletedArticle) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        if (!deletedArticle.userId.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: "You are not authorized to submit this article." });
        }

        await deletedArticle.deleteOne();

        return res.status(200).json({success:true, deletedArticle});

    } catch (error) {
        return res.status(500).json({success:false, message:"Error in deleting Article "});

    }
}

export const approveArticle = async (req, res) => {
  try {
    const { id }= req.params;
    const article = await Article.findById(id);

    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    if (article.status !== 'pending') {
      return res.status(400).json({ success: false, message: "Only pending items can be approved" });
    }

    article.status = 'published';
    article.publishedAt = new Date();
    article.rejectionReason = undefined;

    await article.save();

    res.status(200).json({ success: true, message: "Article successfully published", article });
  } catch (error) {
    console.error("approveArticle error:", error);
    res.status(500).json({ success: false, message: "Error while publishing" });
  }
};

export const rejectArticle = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: "rejection reason is necessary "});

    const { id }= req.params;
    const article = await Article.findById(id);

    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    if (article.status !== 'pending') {
      return res.status(400).json({ success: false, message: "Only pending articles can be rejected." });
    }

    article.status = 'rejected';
    article.rejectionReason = reason;
    article.publishedAt = null;

    await article.save();

    res.status(200).json({ success: true, message: "Article rejected", article });
  } catch (error) {
    console.error("rejectArticle error:", error);
    res.status(500).json({ success: false, message: "Error while refusing" });
  }
};


