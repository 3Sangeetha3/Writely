const Article = require("../models/Article");
const User = require("../models/user");


const createArticle = async (req, res) => {
    const id = req.userId;
    const author = await User.findById(id).exec();

    //console.log('article', { body: req.body });
    if (!req.body.article) {
        return res.status(400).json({ message: "Invalid request structure" });
    }
    const { title = '', description, body, tagList } = req.body.article;

    if (!title || !description || !body) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const article = await Article.create({ title, description, body });
    article.author = id;

    if (Array.isArray(tagList) && tagList.length > 0) {
        article.tagList = tagList;
    }

    await article.save();
    return res.status(200).json({ article: await article.toArticleResponse(author) });
};


const feedArticles = async(req,res) => {
    //in the req\\
    Article.find({})
    .then(articles => {
        res.json(articles);  // Send JSON response with the articles
    })
    .catch(err => {
        console.error('Error fetching articles', err);
        res.status(500).json({ error: 'Error fetching articles' });
    });
  
}

const getArticleWithSlug = async (req,res) => {
    const {slug} = req.params;

    const article = await Article.findOne({slug}).exec();

    if(!article){
        return res.status(401).json({
            message:'Article Not Found'
        })
    }

    return res.status(200).json({
        article:await article.toArticleResponse(false)
    })
}



module.exports = {
    createArticle,
    feedArticles,
    getArticleWithSlug
};