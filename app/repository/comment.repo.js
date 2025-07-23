const sql = require("../libs/db");

exports.createComment = (comment, result) => {
  const query = `
    INSERT INTO comments (content, userId, postId, parentCommentId)
    VALUES (?, ?, ?, ?)
  `;
  sql.query(
    query,
    [comment.content, comment.userId, comment.postId, comment.parentCommentId || null],
    (err, res) => {
      if (err) return result(err, null);
      return result(null, { commentId: res.insertId });
    }
  );
};

exports.getCommentsByPost = (postId, result) => {
  sql.query("SELECT * FROM comments WHERE postId = ?", [postId], (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

exports.getCommentById = (commentId, result) => {
  sql.query("SELECT * FROM comments WHERE commentId = ?", [commentId], (err, res) => {
    if (err || res.length === 0) return result("Not found", null);
    return result(null, res[0]);
  });
};

exports.updateComment = (commentId, content, result) => {
  sql.query(
    "UPDATE comments SET content = ?, updated_at = NOW() WHERE commentId = ?",
    [content, commentId],
    (err, res) => {
      if (err) return result(err, null);
      return result(null, res);
    }
  );
};

exports.deleteComment = (commentId, result) => {
  sql.query("DELETE FROM comments WHERE commentId = ?", [commentId], (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};
