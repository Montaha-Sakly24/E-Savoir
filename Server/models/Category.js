import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    numericId: {
        type: Number,
        unique: true,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        } 
    },
    title: { type: String, required:true, trim: true, unique: true, maxlength: [50, 'Le titre ne peut pas dépasser 50 caractères'] },
    description: { type:String, required:true, trim: true, maxlength: [300, 'Le titre ne peut pas dépasser 300 caractères'] },
    },{
    timestamps: true,
});

const Category = mongoose.model("Category", categorySchema);
export default Category;

