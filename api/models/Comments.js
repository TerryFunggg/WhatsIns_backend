const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp")

const CommentsSchema = new mongoose.Schema({
    publisher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true
    },
    comment:{
        type:String,
        require:true
    }
});

CommentsSchema.plugin(timestamp);
const Comments = mongoose.model("Comments",CommentsSchema);
module.exports = Comments;