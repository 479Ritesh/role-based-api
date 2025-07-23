const Users = require("../repository/comment.repo");
const { HTTP200OK, BADREQUEST, INTERNALSERVERERROR } = require("../libs/httpcode");

exports.createComment = (req, res) => {
  const { content, postId, parentCommentId, userId } = req.body;

  if (!content || !postId || !userId) {
    return res.status(400).send({ message: "Content, userId and postId are required." });
  }

  const comment = { content, userId, postId, parentCommentId };

  Users.createComment(comment, (err, fullComment) => {
    if (err || !fullComment) {
      console.error("Error or no comment returned:", err);
      return res.status(500).send({isSuccessful:false, message: "Error creating comment or fetching data" });
    }

    return res.status(200).send({
      message: "Comment created successfully",
      isSuccessful: true,
      comment: {
        commentId: fullComment.commentId,
        content: fullComment.content,
        userId: fullComment.userId,
        postId: fullComment.postId,
        parentCommentId: fullComment.parentCommentId,
        created_at: fullComment.created_at,
        user: {
          userId: fullComment.userId,
          username: fullComment.username
        },
        post: {
          postId: fullComment.postId,
          title: fullComment.title
        }
      }
    });
  });
};


exports.getCommentsByPost = (req, res) => {
  const postId = req.query.postId;
  if (!postId) {
    return res.status(BADREQUEST).send({ message: "Post ID is required" });
  }

  Users.getCommentsByPost(postId, (err, data) => {
    if (err) return res.status(INTERNALSERVERERROR).send({isSuccessful:false, message: "Error fetching comments" });
    return res.status(HTTP200OK).send(data);
  });
};

exports.updateComment = (req, res) => {
  const { commentId, content } = req.body;

  if (!commentId || !content) {
    return res.status(400).send({ isSuccessful: false, message: "Missing commentId or content" });
  }

  Users.updateComment(commentId, content, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({ isSuccessful: false, message: "Comment not found" });
      }
      return res.status(500).send({ isSuccessful: false, message: "Error updating comment" });
    }

    return res.status(200).send({ isSuccessful: true, message: "Comment updated successfully" });
  });
};

exports.deleteComment = (req, res) => {
  const commentId = req.query.commentId;
if (!commentId) {
    return res.status(BADREQUEST).send({ message: "Comment ID is required" });
  }

    Users.deleteComment(commentId, (err, data) => {
      if (err) return res.status(INTERNALSERVERERROR).send({isSuccessful:false, message: "Error deleting comment" });
      return res.status(HTTP200OK).send({ isSuccessful:true,message: "Comment deleted" });
    });
};
