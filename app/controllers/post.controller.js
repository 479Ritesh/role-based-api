const Users = require("../repository/post.repo");
const {
  HTTP200OK,
  BADREQUEST,
  INTERNALSERVERERROR,
} = require("../libs/httpcode");

exports.createPost = (req, res) => {
  const { title, content, userId } = req.body;
  const thumbnail_url = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;

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
  const { title, content, postId } = req.body;

  if (!postId) {
    return res.status(BADREQUEST).send({
      isSuccessful: false,
      message: "postId is required",
    });
  }

  const updatedPost = {};
  if (title !== undefined) updatedPost.title = title;
  if (content !== undefined) updatedPost.content = content;

  if (req.file) {
    updatedPost.thumbnail_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (req.body.thumbnail_url !== undefined) {
    updatedPost.thumbnail_url = req.body.thumbnail_url;
  }

  if (Object.keys(updatedPost).length === 0) {
    return res.status(BADREQUEST).send({
      isSuccessful: false,
      message: "At least one field must be provided to update",
    });
  }

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
