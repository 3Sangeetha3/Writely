const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');
const User = require('./user');

const ArticleSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  body: { type: String, required: true },
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Add favorites count
  favoritesCount: { type: Number, default: 0 }
}, { timestamps: true });

ArticleSchema.plugin(uniqueValidator);

// Generate slug from title
ArticleSchema.pre('validate', function(next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true }) + '-' + 
                (Math.random() * Math.pow(36, 6) | 0).toString(36);
  }
  next();
});

// Update the toArticleResponse method to include favorite status
ArticleSchema.methods.toArticleResponse = async function(user) {
  const authorDetails = typeof this.author === 'object' 
    ? this.author 
    : await User.findById(this.author).exec();
    
  // If no authorized user or author details not found
  if (!authorDetails) {
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      tagList: this.tagList,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: {
        username: 'unknown',
        bio: '',
        image: '',
      }
    };
  }
  
  // Handle case when user is provided
  const userDoc = typeof user === 'object' && user 
    ? user 
    : user 
      ? await User.findById(user).exec() 
      : null;
  
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: {
      username: authorDetails.username,
      bio: authorDetails.bio || '',
      image: authorDetails.image || '',
    }
  };
};

module.exports = mongoose.model('Article', ArticleSchema);