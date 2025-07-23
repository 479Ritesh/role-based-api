const Users = require("../repository/post.repo");
const {
  HTTP200OK,
  BADREQUEST,
  INTERNALSERVERERROR,
} = require("../libs/httpcode");

exports.createPost = (req, res) => {
  const { title, content, thumbnail_url, userId } = req.body;

  if (!title || !content) {
    return res
      .status(BADREQUEST)
      .send({ message: "Title and content required" });
  }

  const post = { title, content, userId, thumbnail_url };

  Users.createPost(post, (err, data) => {
    if (err)
      return res
        .status(INTERNALSERVERERROR)
        .send({ message: "Error creating post" });
    return res.status(HTTP200OK).send(data);
  });
};

exports.getAllPosts = (req, res) => {
  Users.getAllPosts((err, data) => {
    if (err) {
      return res
        .status(INTERNALSERVERERROR)
        .send({ isSuccessful: false, message: "Error fetching posts" });
    }
    return res.status(HTTP200OK).send(data);
  });
};

exports.getPostById = (req, res) => {
  const postId = req.query.postId;

  if (!postId) {
    return res.status(BADREQUEST).send({ message: "Post ID is required" });
  }

  Users.incrementViewCount(postId, () => {});

  Users.getPostById(postId, (err, post) => {
    if (err) {
      return res.status(BADREQUEST).send({ message: "Post not found" });
    }
    return res.status(HTTP200OK).send(post);
  });
};

exports.updatePost = (req, res) => {
  const { title, content, thumbnail_url, postId } = req.body;

  if (!title || !content) {
    return res.status(BADREQUEST).send({
      isSuccessful: false,
      message: "Title and content are required",
    });
  }

  const updatedPost = { title, content, thumbnail_url, postId };

  Users.updatePost(postId, updatedPost, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(NOTFOUND).send({
          isSuccessful: false,
          message: "Post not found",
        });
      }

      return res.status(INTERNALSERVERERROR).send({
        isSuccessful: false,
        message: "Error updating post",
      });
    }

    return res.status(HTTP200OK).send({
      isSuccessful: true,
      message: "Post updated successfully",
    });
  });
};

exports.deletePost = (req, res) => {
  const postId = req.query.postId;

  if (!postId) {
    return res
      .status(BADREQUEST)
      .send({ isSuccessful: false, message: "Post ID is required" });
  }
  Users.deletePost(postId, (err, data) => {
    if (err)
      return res
        .status(INTERNALSERVERERROR)
        .send({ isSuccessful: false, message: "Error deleting post" });
    return res
      .status(HTTP200OK)
      .send({ isSuccessful: true, message: "Post deleted" });
  });
};
