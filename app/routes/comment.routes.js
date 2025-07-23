module.exports = app => {
    const commentController = require("../controllers/comment.controller");
    const authToken = require('../middleware/authenticationToken.middleware');
    const router = require("express").Router();
  
    router.post("/createComment", authToken, commentController.createComment);
    router.get("/getCommentsByPost", authToken, commentController.getCommentsByPost);
    router.patch("/updateComment", authToken, commentController.updateComment);
    router.delete("/deleteComment", authToken, commentController.deleteComment);
  
    app.use("/api/comments", router);
  };
  