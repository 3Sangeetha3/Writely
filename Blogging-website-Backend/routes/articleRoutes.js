const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');
const verifyJWT = require("../middleware/verifyJWT");

///api/articles
router.post('/',  articlesController.createArticle);


router.get('/feed',articlesController.feedArticles);

router.get('/:slug', articlesController.getArticleWithSlug);





module.exports = router;