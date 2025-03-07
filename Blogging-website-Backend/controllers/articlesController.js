const Article = require("../models/Article");
const User = require("../models/user");
const Comment = require("../models/Comment");

const createArticle = async (req, res) => {
  const id = req.userId;
  const author = await User.findById(id).exec();

  //console.log('article', { body: req.body });
  if (!req.body.article) {
    return res.status(400).json({ message: "Invalid request structure" });
  }
  const { title = "", description, body, tagList } = req.body.article;

  if (!title || !description || !body) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const article = await Article.create({ title, description, body });
  article.author = id;

  if (Array.isArray(tagList) && tagList.length > 0) {
    article.tagList = tagList;
  }

  await article.save();
  return res
    .status(200)
    .json({ article: await article.toArticleResponse(author) });
};

const feedArticles = async (req, res) => {
  try {
    const articles = await Article.find({})
      .populate("author", "username image")
      .exec();
    res.json(articles);
  } catch (err) {
    console.error("Error fetching articles", err);
    res.status(500).json({ error: "Error fetching articles" });
  }
};

const deleteArticle = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).exec();

  if (!user) {
    return res.status(401).json({ message: "User Not Found" });
  }

  const { slug } = req.params;
  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(404).json({ message: "Article Not Found" });
  }

  if (article.author.toString() !== userId.toString()) {
    return res.status(403).json({
      error: "Only the author can delete the article",
    });
  }

  // Delete all associated comments
  await Comment.deleteMany({ article: article._id });
  
  // Delete the article
  await Article.deleteOne({ _id: article._id });

  return res.status(200).json({
    message: "Article has been successfully deleted",
  });
};

const getArticleWithSlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const article = await Article.findOne({ slug })
      .populate("author", "username bio image")
      .populate("comments")
      .sort({ createdAt: -1 })
      .exec();

    if (!article) {
      return res.status(404).json({ message: "Article Not Found" });
    }

    // Respond with the article and the populated author details
    return res.status(200).json({
      article: await article.toArticleResponse(false),
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getArticlesByTag = async (req, res) => {
  try{
    const {tag} = req.query;
    let query = {};
    if(tag){
      query.tagList = tag;
    }

    const articles = await Article.find(query)
      .populate('author', 'username image')
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({ articles });
  }catch(error){
    console.error("Error fetching articles with the tag: ", error);
    res.status(500).json({ message: "Error fetching articles by Tag" });
  }
}

module.exports = {
  createArticle,
  feedArticles,
  getArticleWithSlug,
  getArticlesByTag,
  deleteArticle,
};
