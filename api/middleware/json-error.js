const error = require("koa-json-error");

/**
 *  Wrapping koa-json-error within error formator
 */
module.exports = () => {
    return error((err) => {
        return {
            // original error attributes
            status: err.status || err.statusCode || 500,
            message: err.message,
            name: err.name,
            stack: err.stack, // error stack
            //type: err.type,

            // custom attributes
            code: -1,
        };
    });
};
