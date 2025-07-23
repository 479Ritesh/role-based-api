const sql = require("../libs/db");
const Post = function (post) {
  this.postId = post.postId;                
  this.title = post.title;
  this.content = post.content;
  this.userId = post.userId;               
  this.created_at = post.created_at;
  this.updated_at = post.updated_at;
  this.views_count = post.views_count ;
  this.likes_count = post.likes_count ;
  this.thumbnail_url = post.thumbnail_url;
};


exports.createPost = (post, result) => {
  const query = `
    INSERT INTO posts (title, content, userId, thumbnail_url, created_at, updated_at, views_count, likes_count)
    VALUES (?, ?, ?, ?, NOW(), NOW(), 0, 0)
  `;

  sql.query(query, [post.title, post.content, post.userId, post.thumbnail_url], (err, res) => {
    if (err) return result(err, null);

    const insertedId = res.insertId;

    // Now fetch the inserted post
    sql.query("SELECT * FROM posts WHERE postId = ?", [insertedId], (err2, res2) => {
      if (err2) return result(err2, null);
      result(null, res2[0]); // Send full post data
    });
  });
};


exports.getAllPosts = (result) => {
  const query = `
    SELECT 
      p.postId,
      p.title,
      p.content,
      p.thumbnail_url,
      p.created_at,
      p.updated_at,
      p.views_count,
      p.likes_count,
      u.userId,
      u.username,
      u.email,
      u.isVerified
    FROM posts p
    JOIN users u ON p.userId = u.userId
    ORDER BY p.created_at DESC
  `;

  sql.query(query, (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};


exports.getPostById = (postId, result) => {
  const query = `
    SELECT 
      p.postId,
      p.title,
      p.content,
      p.thumbnail_url,
      p.created_at,
      p.updated_at,
      p.views_count,
      p.likes_count,
      u.userId,
      u.username,
      u.email,
      u.isVerified
    FROM posts p
    JOIN users u ON p.userId = u.userId
    WHERE p.postId = ?
  `;

  sql.query(query, [postId], (err, res) => {
    if (err || res.length === 0) {
      return result("Post not found", null);
    }

    result(null, res[0]);
  });
};


exports.incrementViewCount = (postId, result) => {
  sql.query("UPDATE posts SET views_count = views_count + 1 WHERE postId = ?", [postId], (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

exports.updatePost = (postId, post, result) => {
  if (typeof result !== "function") {
    throw new Error("Callback 'result' must be a function");
  }
  const query = `
    UPDATE posts 
    SET title = ?, content = ?, thumbnail_url = ?, updated_at = NOW() 
    WHERE postId = ?
  `;

  sql.query(
    query,
    [post.title, post.content, post.thumbnail_url, postId],
    (err, res) => {
      if (err) return result(err, null);

      if (res.affectedRows === 0) {
        return result({ kind: "not_found" }, null);
      }

      return result(null, res);
    }
  );
};


exports.deletePost = (postId, result) => {
  sql.query("DELETE FROM posts WHERE postId = ?", [postId], (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};
