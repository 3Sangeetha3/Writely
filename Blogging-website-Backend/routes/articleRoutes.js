const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');
const verifyJWT = require("../middleware/verifyJWT");

///api/articles
router.post('/',verifyJWT,  articlesController.createArticle);


router.get('/feed',articlesController.feedArticles);

router.get('/:slug', articlesController.getArticleWithSlug);

//a route to fetch articles with optional tag filtering
router.get('/', articlesController.getArticlesByTag);





module.exports = router;