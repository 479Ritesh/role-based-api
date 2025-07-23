const Users = require("../repository/post.repo");
const { HTTP200OK, BADREQUEST, INTERNALSERVERERROR } = require("../libs/httpcode");

exports.createPost = (req, res) => {
  const { title, content, thumbnail_url } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(BADREQUEST).send({ message: "Title and content required" });
  }

  const post = { title, content, userId, thumbnail_url };

  Users.createPost(post, (err, data) => {
    if (err) return res.status(INTERNALSERVERERROR).send({ message: "Error creating post" });
    return res.status(HTTP200OK).send(data);
  });
};

exports.getAllPosts = (req, res) => {
  Users.getAllPosts((err, data) => {
    if (err) return res.status(INTERNALSERVERERROR).send({ message: "Error fetching posts" });
    return res.status(HTTP200OK).send(data);
  });
};

exports.getPostById = (req, res) => {
  const postId = req.params.id;

  Users.incrementViewCount(postId, () => {});

  Users.getPostById(postId, (err, post) => {
    if (err) return res.status(BADREQUEST).send({ message: "Post not found" });
    return res.status(HTTP200OK).send(post);
  });
};

exports.updatePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  Users.getPostById(postId, (err, post) => {
    if (err || post.userId !== userId) {
      return res.status(403).send({ message: "Not authorized to update this post" });
    }

    Users.updatePost(postId, req.body, (err, data) => {
      if (err) return res.status(INTERNALSERVERERROR).send({ message: "Error updating post" });
      return res.status(HTTP200OK).send({ message: "Post updated", data });
    });
  });
};

exports.deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  Users.getPostById(postId, (err, post) => {
    if (err || post.userId !== userId) {
      return res.status(403).send({ message: "Not authorized to delete this post" });
    }

    Users.deletePost(postId, (err, data) => {
      if (err) return res.status(INTERNALSERVERERROR).send({ message: "Error deleting post" });
      return res.status(HTTP200OK).send({ message: "Post deleted" });
    });
  });
};
