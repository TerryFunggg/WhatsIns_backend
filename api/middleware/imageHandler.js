/*
 * @author: Terry Fung
 * @since: Tuesday, 21st April 2020 10:43:42 am
 */
const multer = require("koa-multer");
const path = require("path");
const uuid = require("uuid");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads"),
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, uuid.v4() + ext);
    },
});

const filter = function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/pug") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploads = multer({
    storage,
    filter,
    limits: {
        fileSize: 1024 * 1025 * 5,
    },
});

module.exports = uploads;
