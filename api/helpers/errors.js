function error(name, default_message) {
    function ErrorConstructor(message) {
        this.name = name;
        this.message = message || default_message;
        this.stack = new Error().stack;
    }
    ErrorConstructor.prototype = Object.create(Error.prototype);
    ErrorConstructor.prototype.constructor = ErrorConstructor;
    return ErrorConstructor;
}

module.exports = {
    ItemAlreadyExistsError: error(
        "ItemAlreadyExistsError",
        "Item already exists"
    ),
    NotFoundError: error("NotFoundError", "item not found"),
    ValidationError: error("ValidationError", "Invalid data"),
    InternalServerError: error("InternalServerError", "Internal Server Error"),
    ConfirmationError: error(
        "ConfirmationError",
        "Confirmation code dose not match"
    ),
    AuthorizationError: error("AuthorizationError", "Unauthorized"),
    GatewayError: error("GatewayError", "Received an unexpected response"),
    throws
};

function throws(err, ctx) {
    switch (err.name) {
        case "ValidationError":
        case "ConfirmationError":
            return ctx.throw(400, err.message);
        case "AuthorizationError":
            return ctx.throw(401, err.message);
        case "NotFoundError":
            return ctx.throw(404, err.message);
        case "MethodNotAllowedError":
            return ctx.throw(405, err.message);
        case "ItemAlreadyExistsError":
            return ctx.throw(409, err.message);
        case "InternalServerError":
            return ctx.throw(500, err.message);
        case "GatewayError":
            return ctx.throw(502, err.message);
        default:
            console.error(err);
            return ctx.throw(500, "InternalServerError");
    }
}
