module.exports = app => {
    const commentController = require("../controllers/comment.controller");
    const auth = require("../middleware/authentication.middleware");
    const router = require("express").Router();
  
    router.post("/", auth, commentController.createComment);
    router.get("/post/:postId", auth, commentController.getCommentsByPost);
    router.put("/:id", auth, commentController.updateComment);
    router.delete("/:id", auth, commentController.deleteComment);
  
    app.use("/api/comments", router);
  };
  