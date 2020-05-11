/*
 * Movie
 * @author: Terry Fung
 * @since: Monday, 6th April 2020 11:15:13 am
 */

const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const PostsSchema = new mongoose.Schema({
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    desc: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: "",
    },
    like: [],
});

PostsSchema.plugin(timestamp);

const Posts = mongoose.model("Posts", PostsSchema);
module.exports = Posts;
