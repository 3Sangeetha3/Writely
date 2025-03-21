const Article = require("../models/Article");
const User = require("../models/user");

const Comment = require("../models/Comment");

const addCommentsToArticle = async (req, res) => {
  const id = req.userId;

  const commentor = await User.findById(id).exec();

  if (!commentor) {
    return res.status(401).json({
      message: "User Not Found",
    });
  }

  const { slug } = req.params;

  const article = await Article.findOne({ slug }).exec();
  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }
  //console.log('req.body',req.body)
  const { body } = req.body.comment;

  const newComment = await Comment.create({
    body: body,
    author: commentor._id,
    article: article._id,
  });

  //article will be having multiple comments

  await article.addComment(newComment._id);

  return res.status(201).json({
    comment: await newComment.toCommentResponse(commentor),
  });
};

const getCommentsFromArticle = async (req, res) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug }).exec();

  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  if (!article.comments || !Array.isArray(article.comments)) {
    return res.status(200).json({
      comments: [],
    });
  }

  const loggedin = req.loggedin;

  if (loggedin) {
    const loginUser = await User.findById(req.userId).exec();

    return res.status(200).json({
      comments: await Promise.all(
        article.comments.map(async (commentId) => {
          const commentObj = await Comment.findById(commentId).exec();
          return commentObj
            ? await commentObj.toCommentResponse(loginUser)
            : null;
        })
      ),
    });
  } else {
    return res.status(200).json({
      comments: (await Promise.all(
        article.comments.map(async (commentId) => {
          const commentObj = await Comment.findById(commentId).exec();
          return commentObj ? await commentObj.toCommentResponse(false) : null;
        })
      )).filter(comment => comment !== null)
    });
  }
};
const deleteComment = async (req, res) => {
  const userId = req.userId;

  const commentor = await User.findById(userId).exec();

  if (!commentor) {
    return res.status(401).json({
      message: "User Not Found",
    });
  }

  const { slug, id } = req.params;

  const article = await Article.findOne({ slug }).exec();
  if (!article) {
    return res.status(401).json({
      message: "Article Not Found",
    });
  }

  const comment = await Comment.findById(id).exec();

  // console.log('comment',comment)
  if (comment.author.toString() === commentor._id.toString()) {
    //go to article and remove the comment from that array

    await article.removeComment(comment._id);
    //go to comments doc and del particlar comment

    await Comment.deleteOne({ _id: comment._id });

    return res.status(200).json({
      message: "Comment has been successfully deleted",
    });
  } else {
    return res.status(403).json({
      error: "Only the author of the comment can delete the comment",
    });
  }
};

module.exports = {
  addCommentsToArticle,
  getCommentsFromArticle,
  deleteComment,
};
