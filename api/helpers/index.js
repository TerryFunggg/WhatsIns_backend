/*
 * -----
 * @author: Terry Fung
 * @since: Wednesday, 1st April 2020 12:20:26 am
 * -----
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const errors = require("../helpers/errors");

/**
 *  Return some simple message to client
 * @param {String} message message string
 * @param {Number} code code number 0: ok , -1: faile
 */
function message(message, code) {
    return {
        message,
        code,
    };
}

/**
 *  A function of hashing user password
 * @param {String} password message string
 * @returns  hash password
 */
function hashPwd(password, salt = 10) {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) reject(new errors.InternalServerError());
            resolve(hash);
        });
    });
}

function comparePwd(db_pwd, user_pwd) {
    return new Promise(async (resolve, reject) => {
        bcrypt.compare(db_pwd, user_pwd, (err, match) => {
            // Check password
            if (match) resolve(match);
            reject(new errors.ConfirmationError());
        });
    });
}
/**
 *  Check the the email is validate eemail
 * @param {String} email message string
 * @returns Boolean
 */
function isEmail(email) {
    return (
        email.match(
            /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        ) != null
    );
}

function createToken(user) {
    const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "1d",
    });
    //const { iat, exp } = jwt.decode(token);
    return token;
}

module.exports = {
    message,
    hashPwd,
    isEmail,
    createToken,
    comparePwd,
};
