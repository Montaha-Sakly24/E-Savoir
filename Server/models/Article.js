import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [120, 'Le titre ne peut excéder 120 caractères']
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
  },
  tags: {
    type: [{
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(tag) {
          return /^#[a-z0-9_]{2,20}$/.test(tag);
        },
        message: props => `"${props.value}" : Format invalide. Utilisez #mot_cle (2-20 caractères)`
      }
    }],
    validate: [
      {
        validator: function(tags) {
          return tags.length <= 5;
        },
        message: 'Maximum 5 tags par article'
      },
      {
        validator: function(tags) {
          return new Set(tags).size === tags.length;
        },
        message: 'Tags en doublon détectés'
      }
    ]
  },
  coverImage: {
    type: String,
    validate: {
      validator: function(v) {
        return /\.(jpg|jpeg|png|webp)$/i.test(v);
      },
      message: 'Format image invalide (jpg, png, webp)'
    }
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: { 
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected', 'amended'],
    default: 'draft'
  },
  submittedAt: Date,
  publishedAt: Date,
  rejectionReason: String,

  pendingUpdate: {
    type: Object,
    default: null
  },
  hasPendingUpdate: {
      type: Boolean,
      default: false
  }

}, {
  timestamps: true,
  
});   

const Article = mongoose.model("Article", articleSchema);
export default Article;

