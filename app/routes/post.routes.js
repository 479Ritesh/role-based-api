module.exports = (app) => {
  const postController = require("../controllers/post.controller");
  const authToken = require("../middleware/authenticationToken.middleware");

  const router = require("express").Router();

  router.post("/createPost", authToken, postController.createPost);
  router.get("/getAllPosts", authToken, postController.getAllPosts);
  router.get("/getPostById", authToken, postController.getPostById);
  router.patch("/updatePost", authToken, postController.updatePost);
  router.delete("/deletePost", authToken, postController.deletePost);

  app.use("/api/posts", router);
};
