const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const User = require("./user");
const slugify = require("slugify");

// Define the schema for articles
const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tagList: [
      {
        type: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

articleSchema.plugin(uniqueValidator);

// Middleware to run before saving the article
articleSchema.pre('save', function(next){
    this.slug = slugify(this.title, {lower:true, replacement:'-'});
    next();
});

// Method to generate the article response
articleSchema.methods.toArticleResponse = async function (user) {
  const authorObj = await User.findById(this.author).exec();

  if (!authorObj) {
    // Handle the case where the author is not found
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      favourited: false,
      favouritesCount: this.favouritesCount,
      author: {
        username: "Unknown",
        bio: "",
        image: "",
        following: false
      },
    };
  }

  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favourited: false,
    favouritesCount: this.favouritesCount,
    author: authorObj.toProfileJSON(user),
  };
};

// Method to add a comment to the article
articleSchema.methods.addComment = async function (commentId) {
  if (this.comments.indexOf(commentId) === -1) {
    this.comments.push(commentId);
  }
  return this.save();
};

// Method to remove a comment from the article
articleSchema.methods.removeComment = async function (commentId) {
  if (this.comments.indexOf(commentId) !== -1) {
    this.comments.remove(commentId);
  }
  return this.save();
};

module.exports = mongoose.model("Article", articleSchema);
