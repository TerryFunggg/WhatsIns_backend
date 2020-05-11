/**
 *  Return API response time to client
 */
function responseTime() {
    // wrapping the async function,
    //it can fixable to accept option in later
    return async function(ctx, next) {
        const start = Date.now();
        await next();
        const end = Date.now();
        ctx.set("X-Response-Time", `${end - start}ms`);
    };
}

module.exports = responseTime;
