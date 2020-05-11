/*
 * @author Terry Fung
 * @since 30-3-2020
 *
 */

const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const logger = require("koa-logger");
const cors = require("koa2-cors");
const static = require("koa-static");
const path = require("path");
const mongoose = require("mongoose");
const error = require("./api/middleware/json-error");
const responseTime = require("./api/middleware/responseTime");
const config = require("./config");

/* ################################## */
/* Middleware                         */
/* ################################## */
//app.use(cors(config.CORS_OPT));
app.use(logger());
app.use(error());
app.use(responseTime());
app.use(bodyParser());
app.use(static(path.join(__dirname, "/uploads")));
app.use(json());

/* ################################## */
/* Router                             */
/* ################################## */
const router = require("./api/routes/index");
const userRouter = require("./api/routes/user");
app.use(router.routes()).use(router.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());

/* ################################## */
/* MongoDB setUp                      */
/* ################################## */
mongoose.connect(config.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", (err) => {
    console.log(err);
    db.close();
});

/* ################################## */
/* app listen                         */
/* ################################## */
app.listen(config.PORT);
console.log(`Server started on port ${config.PORT}`);

app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
});

module.exports = app;
