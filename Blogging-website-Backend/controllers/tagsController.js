const Article = require("../models/Article");



const getTags = async (req, res) => {

    //return distinct tags 

    const tags = await Article.find().distinct('tagList').exec();
    //console.log("tags", tags);

    res.status(200).json({
        tags:tags
    });

};


module.exports = {
    getTags
}