import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
    try {
        const {title, description} = req.body;

        const exists = await Category.findOne({ title: title.trim() });
        if (exists) {
            return res.status(400).json({ success: false, message: "Cette catégorie existe déjà." });
        }

        const lastCategory = await Category.findOne().sort({ numericId: -1 });
        const nextId = lastCategory ? lastCategory.numericId + 1 : 1;

        const newCategory = new Category({ title, description,  numericId: nextId });

        await newCategory.save();

        return res.status(200).json({success:true, message:"Category created successfully"});

    } catch (error) {
        console.error('GET /api/Category error:', error); 
                return res.status(500).json({success:false, message:"Error in adding Category "});

    }
}

export const getOne = async (req, res) => {
    try {
        const { id } =req.params;
        const category = await Category.findById(id);

        if (!category) {
           return res.status(404).json({ success: false, message: "Category not found" });
        }
        
        return res.status(200).json({success:true, category});

    } catch (error) {
                return res.status(500).json({success:false, message:"Error in fetching Category"});

    }
}

export const getAllCategories = async (_, res) => {
    try {
        const categories = await Category.find();
        
        if (!categories || categories.length === 0) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }
        return res.status(200).json({ success: true, categories });
    } catch (error) {
                return res.status(500).json({ success: false, message: "Error in fetching Categories" });
    }
}

export const editCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updateCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.status(200).json({success:true, updateCategory});

    } catch (error) {
        return res.status(500).json({success:false, message:"Error in editing Category "});
    }
}

export const deleteCategory= async (req, res) => {
    try {
        const {id} = req.params;
        const deleteCategory = await Category.findByIdAndDelete(id);

        if (!deleteCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.status(200).json({success:true, deleteCategory});
    } catch (error) {
        return res.status(500).json({success:false, message:"Error in deleting Category "});
    }
}
