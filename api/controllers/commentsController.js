const Comments = require("../models/Comments");
const config = require("../../config");
const { message } = require("../helpers/index");

const errors = require("../helpers/errors");

exports.addCommentByPostId = async (ctx, next) => {
    try {
        const c = await addComment(ctx.request.body);
        ctx.status = 201;
        ctx.body = message("create successful", 0);
        await next();
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

exports.getCommentByPostId = async (ctx, next) => {
    try {
        const comments = await findComment(ctx.params.pid);
        ctx.status = 200;
        ctx.body = {
            comments,
        };
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

async function findComment(pid) {
    return Comments.find({ post: pid });
}

async function addComment(item) {
    try {
        const newComm = new Comments({
            publisher: item.uid,
            post: item.pid,
            comment: item.comment,
        });
        await newComm.save();
    } catch (err) {
        return new errors.InternalServerError();
    }
}
