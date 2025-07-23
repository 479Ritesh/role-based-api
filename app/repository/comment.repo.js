const sql = require("../libs/db");
const Comment = function (comment) {
  this.commentId = comment.commentId;
  this.content = comment.content;
  this.userId = comment.userId;
  this.postId = comment.postId;
  this.parentCommentId = comment.parentCommentId || null;
  this.created_at = comment.created_at;
  this.updated_at = comment.updated_at;
};

exports.createComment = (comment, result) => {
  const insertQuery = `
    INSERT INTO comments (content, userId, postId, parentCommentId, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  sql.query(
    insertQuery,
    [
      comment.content,
      comment.userId,
      comment.postId,
      comment.parentCommentId || null,
    ],
    (err, res) => {
      if (err) {
        console.error("Insert Error:", err);
        return result(err, null);
      }

      const commentId = res.insertId;

      const fetchQuery = `
        SELECT 
          c.commentId, c.content, c.userId, c.postId, c.parentCommentId, c.created_at,
          u.username, p.title
        FROM comments c
        JOIN users u ON u.userId = c.userId
        JOIN posts p ON p.postId = c.postId
        WHERE c.commentId = ?
      `;

      sql.query(fetchQuery, [commentId], (fetchErr, fetchRes) => {
        if (fetchErr) {
          console.error("Fetch Error:", fetchErr);
          return result(fetchErr, null);
        }

        if (!fetchRes.length) {
          console.warn("Comment inserted, but JOIN fetch returned nothing.");
          return result({ kind: "not_found" }, null);
        }

        result(null, fetchRes[0]);
      });
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
  sql.query(
    "SELECT * FROM comments WHERE commentId = ?",
    [commentId],
    (err, res) => {
      if (err || res.length === 0) return result("Not found", null);
      return result(null, res[0]);
    }
  );
};

exports.updateComment = (commentId, content, result) => {
  const query =
    "UPDATE comments SET content = ?, updated_at = NOW() WHERE commentId = ?";

  sql.query(query, [content, commentId], (err, res) => {
    if (err) return result(err, null);

    if (res.affectedRows === 0) {
      return result({ kind: "not_found" }, null);
    }

    return result(null, res);
  });
};

exports.deleteComment = (commentId, result) => {
  sql.query(
    "DELETE FROM comments WHERE commentId = ?",
    [commentId],
    (err, res) => {
      if (err) return result(err, null);
      return result(null, res);
    }
  );
};
