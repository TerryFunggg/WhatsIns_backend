/*
 * @author: Terry Fung
 * @since: Tuesday, 7th April 2020 2:08:07 pm
 */

const Posts = require("../models/Posts");
const User = require("../models/User");
const config = require("../../config");
const { message } = require("../helpers/index");

const errors = require("../helpers/errors");

exports.addPosts = async (ctx, next) => {
    try {
        const posts = await addPosts(ctx.req);
        ctx.status = 201;
        ctx.body = message("Posts Created");
        next();
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

exports.getAllPosts = async (ctx, next) => {
    try {
        const posts = await getAll();
        ctx.status = 200;
        ctx.body = { posts: posts };
    } catch (err) {
        return errors.throws(err, ctx);
    }
};

exports.getPostsByUid = async (ctx, next) => {
    try {
        const uid = ctx.params.id;
        const posts = await findPostByUid(uid);
        ctx.status = 200;
        ctx.body = { posts };
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

exports.getPostsByPostID = async (ctx, next) => {
    try {
        const pid = ctx.params.id;
        const post = await findPostByPid(pid);
        ctx.status = 200;
        ctx.body = {
            publisher: post.publisher,
            desc: post.desc,
            image: post.image,
            like: post.like,
            label: post.label,
        };
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

exports.updateDescByPid = async (ctx, next) => {
    try {
        const p = await updateDesc(ctx.params.id, ctx.request.body.desc);
        ctx.status = 200;
        ctx.body = message("update successful", 0);
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

exports.updatePostlike = async (ctx, next) => {
    try {
        const uid = ctx.params.id;
        const post_id = ctx.request.body.pid;
        const islike = ctx.request.body.isLike;
        const posts = null;
        if (islike == "true") {
            await updateLike(uid, post_id);
        } else if (islike == "false") {
            await updateUnLike(uid, post_id);
        }

        ctx.status = 200;
        ctx.body = message("update successful", 0);
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

exports.deletePostById = async (ctx, next) => {
    try {
        const p = await deletePost(ctx.params.pid);
        ctx.status = 200;
        ctx.body = message("delete successful", 0);
    } catch (err) {
        return errors.throws(err, ctx);
    }
};

exports.fetchPostByUid = async (ctx, next) => {
    try {
        const f = await findFollowing(ctx.params.id);
        const posts = await fetchPosts(f.following);
        ctx.status = 200;
        ctx.body = { posts: posts };
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

async function deletePost(pid) {
    return await Posts.deleteOne({ _id: pid });
}

// TODO: Should be set some limit
async function getAll() {
    return await Posts.find();
}

async function updateDesc(pid, desc) {
    return await Posts.updateOne({ _id: pid }, { desc: desc });
}

async function updateLike(uid, pid) {
    return await Posts.updateOne({ _id: pid }, { $push: { like: uid } });
}

async function updateUnLike(uid, pid) {
    return await Posts.updateOne({ _id: pid }, { $pull: { like: uid } });
}

async function findFollowing(uid) {
    return await User.findById({ _id: uid }).select("following");
}

async function fetchPosts(following) {
    return await Posts.find({ publisher: { $in: following } }).sort({
        createdAt: 1,
    });
}

async function addPosts(req) {
    // TODO: check the id is registed
    const { publisher, desc, label } = req.body;

    try {
        const newPosts = new Posts({ publisher, desc, label });
        newPosts.image = config.BASE_URL + "/" + req.file.filename;
        await newPosts.save();
    } catch (e) {
        return new errors.InternalServerError();
    }
}

async function findPostByUid(uid) {
    // TODO: set the limit
    return Posts.find({ publisher: uid });
}

async function findPostByPid(_id) {
    return Posts.findOne({ _id });
}
