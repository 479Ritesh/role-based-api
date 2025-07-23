module.exports = app => {
    const postController = require("../controllers/post.controller");
    const auth = require("../middleware/authentication.middleware");
  
    const router = require("express").Router();
  
    router.post("/", auth, postController.createPost);
    router.get("/", auth, postController.getAllPosts);
    router.get("/:id", auth, postController.getPostById);
    router.put("/:id", auth, postController.updatePost);
    router.delete("/:id", auth, postController.deletePost);
  
    app.use("/api/posts", router);
  };
  