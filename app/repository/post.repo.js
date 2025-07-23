const sql = require("../libs/db");

exports.createPost = (post, result) => {
  const query = `
    INSERT INTO posts (title, content, userId, thumbnail_url, created_at, updated_at, views_count, likes_count)
    VALUES (?, ?, ?, ?, NOW(), NOW(), 0, 0)
  `;
  sql.query(
    query,
    [post.title, post.content, post.userId, post.thumbnail_url],
    (err, res) => {
      if (err) return result(err, null);
      return result(null, { postId: res.insertId });
    }
  );
};

exports.getAllPosts = (result) => {
  sql.query("SELECT * FROM posts", (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

exports.getPostById = (postId, result) => {
  sql.query("SELECT * FROM posts WHERE postId = ?", [postId], (err, res) => {
    if (err || res.length === 0) return result("Post not found", null);
    return result(null, res[0]);
  });
};

exports.incrementViewCount = (postId, result) => {
  sql.query("UPDATE posts SET views_count = views_count + 1 WHERE postId = ?", [postId], (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

exports.updatePost = (postId, post, result) => {
  const query = `
    UPDATE posts 
    SET title = ?, content = ?, thumbnail_url = ?, updated_at = NOW() 
    WHERE postId = ?
  `;
  sql.query(query, [post.title, post.content, post.thumbnail_url, postId], (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

exports.deletePost = (postId, result) => {
  sql.query("DELETE FROM posts WHERE postId = ?", [postId], (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};
