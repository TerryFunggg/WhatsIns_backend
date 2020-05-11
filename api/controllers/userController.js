/*
 *  router controller function for user
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:27:29 pm
 */

const User = require("../models/User");
const Posts = require("../models/Posts");
const config = require("../../config");
const {
    createToken,
    message,
    comparePwd,
    hashPwd,
} = require("../helpers/index");

const errors = require("../helpers/errors");

/**
 *  Register new user function
 *  It will using bcrypt to hash the user password,
 *  After that insert new User in DB
 *  @returns 201 Created status
 *  @throws 409 - ConflictError
 */
exports.user_register = async (ctx, next) => {
    try {
        const user = await add(ctx.req);
        ctx.status = 201;
        ctx.body = message("User Created", 0);
        await next();
    } catch (err) {
        return errors.throws(err, ctx);
    }
};

/**
 *  User Login function
 *  It will check the password in users.authenticate using bcryptjs,
 *  If success , it will create and return JWT to client
 * @returns token
 * @throws UnauthorizedError 401
 */
exports.user_login = async (ctx, next) => {
    try {
        const user = await authenticate(ctx.user.email, ctx.user.password);
        // Create JWT and send to the client
        const token = createToken(user);
        // Send response to client
        ctx.status = 200;
        ctx.body = { uid: user._id, token, code: 0 };
        await next();
    } catch (err) {
        return errors.throws(err, ctx);
    }
};

exports.getUserByName = async (ctx, next) => {
    try {
        const name = ctx.request.query.key;
        const users = await findUsersByName(name);
        ctx.status = 200;
        ctx.body = { users };
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

exports.getUserById = async (ctx, next) => {
    try {
        const id = ctx.params.id;
        const user = await findUserById(id);
        const post_num = await getPostsNumber(id);
        const following_num = user.following.length;
        const followers_num = user.followers.length;
        ctx.status = 200;
        ctx.body = {
            id: user._id,
            name: user.name,
            avatar: user.avatar,
            post_num,
            following_num,
            followers_num,
            following: user.following,
            followers: user.followers,
        };
        await next();
    } catch (err) {}
};

exports.updateUserFollowing = async (ctx, next) => {
    try {
        const following_id = ctx.request.body.fid;
        const f = await updateFollowing(ctx.params.id, following_id);
        const u = await updateFollowers(following_id, ctx.params.id);
        ctx.status = 201;
        ctx.body = message("update successful", 0);
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

exports.removeUserFollowing = async (ctx, next) => {
    try {
        const unfollow_id = ctx.request.query.fid;
        const f = await removeFollowing(ctx.params.id, unfollow_id);
        const u = await removeFollowers(unfollow_id, ctx.params.id);
        ctx.status = 201;
        ctx.body = message("delete successful", 0);
    } catch (e) {
        return errors.throws(e, ctx);
    }
};

async function removeFollowing(uid, fid) {
    return await User.updateOne(
        { _id: uid },
        {
            $pull: { following: fid },
        }
    );
}
async function removeFollowers(fid, uid) {
    return await User.updateOne(
        { _id: fid },
        {
            $pull: { followers: uid },
        }
    );
}

async function findUsersByName(name) {
    const reg = new RegExp(name, "i");
    return await User.find({ name: { $regex: reg } }).select(
        "_id avatar name followers"
    );
}

async function findUserById(uid) {
    return await User.findById(uid);
}

async function getPostsNumber(uid) {
    return await Posts.count({
        publisher: uid,
    });
}

async function updateFollowing(uid, follow_id) {
    return await User.updateOne(
        { _id: uid },
        { $push: { following: follow_id } }
    );
}

async function updateFollowers(fid, uid) {
    return await User.updateOne(
        { _id: fid },
        {
            $push: { followers: uid },
        }
    );
}

/**
 *  Authentication of User login.
 * @param {String} email user email
 * @param {String} password user password
 * @returns user
 */
function authenticate(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email }); // Get user by email
            await comparePwd(password, user.password);
            resolve(user); // if success, then return user.
        } catch (err) {
            reject(new errors.ConfirmationError());
        }
    });
}

/**
 *  add user to DB
 * @param {any} user
 */
async function add(req) {
    const { email, password, name } = req.body;
    let avatar = req.file || null;

    //Check email duplicate
    const getUser = await User.find({ email });
    if (getUser.length >= 1) {
        throw new errors.ItemAlreadyExistsError();
    }
    // create new user
    try {
        const newUser = new User({ email, name, password });
        // if User upload the avatar
        if (avatar != null) {
            newUser.avatar = config.BASE_URL + "/" + avatar.filename;
        }
        // hash pwd
        const hash = await hashPwd(newUser.password);
        newUser.password = hash;
        await newUser.save();
    } catch (err) {
        return new errors.InternalServerError();
    }
}
