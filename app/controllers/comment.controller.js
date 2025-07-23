const Users = require("../repository/comment.repo");
const { HTTP200OK, BADREQUEST, INTERNALSERVERERROR } = require("../libs/httpcode");

exports.createComment = (req, res) => {
  const { content, postId, parentCommentId } = req.body;
  const userId = req.user.id;

  if (!content || !postId) {
    return res.status(BADREQUEST).send({ message: "Content and postId are required." });
  }

  const comment = { content, userId, postId, parentCommentId };

  Users.createComment(comment, (err, data) => {
    if (err) return res.status(INTERNALSERVERERROR).send({ message: "Error creating comment" });
    return res.status(HTTP200OK).send(data);
  });
};

exports.getCommentsByPost = (req, res) => {
  const postId = req.params.postId;

  Users.getCommentsByPost(postId, (err, data) => {
    if (err) return res.status(INTERNALSERVERERROR).send({ message: "Error fetching comments" });
    return res.status(HTTP200OK).send(data);
  });
};

exports.updateComment = (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  Users.getCommentById(commentId, (err, comment) => {
    if (err || !comment || comment.userId !== userId) {
      return res.status(403).send({ message: "Not authorized to update this comment" });
    }

    Users.updateComment(commentId, req.body.content, (err, data) => {
      if (err) return res.status(INTERNALSERVERERROR).send({ message: "Error updating comment" });
      return res.status(HTTP200OK).send({ message: "Comment updated" });
    });
  });
};

exports.deleteComment = (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  Users.getCommentById(commentId, (err, comment) => {
    if (err || !comment || comment.userId !== userId) {
      return res.status(403).send({ message: "Not authorized to delete this comment" });
    }

    Users.deleteComment(commentId, (err, data) => {
      if (err) return res.status(INTERNALSERVERERROR).send({ message: "Error deleting comment" });
      return res.status(HTTP200OK).send({ message: "Comment deleted" });
    });
  });
};
