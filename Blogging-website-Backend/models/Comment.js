const User = require("./user");
const mongoose  =require('mongoose');

const commentSchema = new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    article:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Article'
    }

}, {
    timestamps:true
});

commentSchema.methods.toCommentResponse = async function(user){
    const authorObj =await User.findById(this.author).exec();
    const authorProfile = authorObj 
    ? authorObj.toProfileJSON(user)
    : { username: "Unknown", bio: "", image: "" };
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: authorProfile
    }

}

module.exports = mongoose.model('Comment', commentSchema)