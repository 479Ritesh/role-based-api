module.exports = (app) => {
  const postController = require("../controllers/post.controller");
  const authToken = require("../middleware/authenticationToken.middleware");
  const upload = require("../libs/upload");
  const router = require("express").Router();

  router.post(
    "/createPost",
    upload.single("thumbnail_url"),
    postController.createPost
  );

  router.get("/getAllPosts", authToken, postController.getAllPosts);
  router.get("/getPostById", authToken, postController.getPostById);
  router.patch(
    "/updatePost",
    upload.single("thumbnail_url"),
    postController.updatePost
  );
  router.delete("/deletePost", authToken, postController.deletePost);

  app.use("/api/posts", router);
};
