/*
 * -----
 * User router
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:24:41 pm
 * -----
 */
// TODO: checka auth tonken
const Router = require("koa-router");
const router = new Router({
    prefix: "/api",
});

//image handle
const multer = require("../middleware/imageHandler");
const validation = require("../middleware/validation");
/*---------------------
    Inport Controller
----------------------*/
const PostsController = require("../controllers/postsController");

router.post(
    "/posts",
    //validation.validateToken,
    multer.single("post"),
    //validation.validateRegister,
    PostsController.addPosts
);

// Get user posts
router.get("/posts/", PostsController.getAllPosts);
router.get("/posts/user/:id", PostsController.getPostsByUid);
router.get("/post/:id", PostsController.getPostsByPostID);
//Fetch following user posts
router.get("/posts/:id", PostsController.fetchPostByUid);
router.put("/post/desc/:id", PostsController.updateDescByPid);
// like photo
router.put("/posts/like/:id", PostsController.updatePostlike);
router.del("/post/:pid", PostsController.deletePostById);

// Comment
const CommentController = require("../controllers/commentsController");
router.post("/comments/post", CommentController.addCommentByPostId);
router.get("/comments/post/:pid", CommentController.getCommentByPostId);

//const FollowingController = require("../controllers/followingController");
//router.get("/following/:id", FollowingController.getFollowingById);

// Testing
//const validation = require("../middleware/validation");
router.post("/test", validation.validateToken, async (ctx, next) => {
    ctx.body = { token: ctx.token };
});

module.exports = router;
