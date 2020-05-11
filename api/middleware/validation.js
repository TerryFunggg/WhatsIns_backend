const { isEmail } = require("../helpers/index");
const errors = require("../helpers/errors");

exports.validateRegister = async (ctx, next) => {
    const data = ctx.req.body;
    console.log(data.email);
    const e = (data) => !!data.email && isEmail(data.email);
    const p = (data) => !!data.password;
    const n = (data) => !!data.name;
    const checks = [e, p, n];

    const isPass = (check) => check(data);

    if (checks.every(isPass)) {
        await next();
    } else {
        errors.throws(new errors.ConfirmationError(), ctx);
    }
};

exports.validateLogin = async (ctx, next) => {
    const data = ctx.request.body;
    console.log(data);
    const e = (data) => !!data.email && isEmail(data.email);
    const p = (data) => !!data.password;

    const checks = [e, p];

    const isPass = (check) => check(data);

    if (checks.every(isPass)) {
        ctx.user = data;
        await next();
    } else {
        errors.throws(new errors.ConfirmationError(), ctx);
    }
};

exports.validateAddPost = async (ctx, next) => {
    const data = ctx.req.body;
    if (!!data.publisher) {
        await next;
    } else {
        errors.throws(new errors.ConfirmationError(), ctx);
    }
};

exports.validateToken = async (ctx, next) => {
    const header = ctx.request.header["authorization"];
    if (!!!header) {
        errors.throws(new errors.AuthorizationError(), ctx);
    }
    const token = header.split(" ")[1];
    ctx.token = token;
    await next();
};
