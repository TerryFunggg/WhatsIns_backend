const Router = require("koa-router");
const validate = require("../middleware/validation");
const multer = require("../middleware/imageHandler");
const router = new Router({
    prefix: "/user",
});
/*---------------------
    Inport Controller
----------------------*/
const UserController = require("../controllers/userController");
/*---------------------
    Router
----------------------*/
router.get("/:id", UserController.getUserById);
router.get("/", UserController.getUserByName);

router.post(
    "/register",
    multer.single("avatar"),
    validate.validateRegister,
    UserController.user_register
);
router.post("/login", validate.validateLogin, UserController.user_login);

router.put("/following/:id", UserController.updateUserFollowing);
router.del("/following/:id", UserController.removeUserFollowing);

module.exports = router;
