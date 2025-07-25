const Users = require("../repository/adminDashboard.repo");
const {
  INTERNALSERVERERROR,
  HTTP200OK,
  BADREQUEST,
} = require("../libs/httpcode");

exports.getAllUser = (req, res) => {
  Users.getAllUser((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(NOTFOUND).send({
          message: "No users found.",
        });
      } else {
        return res.status(INTERNALSERVERERROR).send({
          message: "Error retrieving users.",
        });
      }
    } else {
      return res.status(HTTP200OK).send(data);
    }
  });
};

exports.deleteUser = (req, res) => {
  const user_id = req.params.user_id;
  if (!user_id) {
    res.status(BADREQUEST).send({
      message: "User ID can not be empty!",
    });
    return;
  }
  Users.deleteUser(user_id, (err, data) => {
    if (err) {
      res.status(INTERNALSERVERERROR).send({
        message: err.message || "Some error occurred while deleting user.",
      });
    } else {
      res.status(HTTP200OK).send(data);
    }
  });
};

exports.VerifiedByAdmin = (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(BADREQUEST).send({
      message: "User ID is required.",
    });
  }

  Users.VerifiedByAdmin(userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(NOTFOUND).send({
          message: `User not found with ID ${userId}.`,
        });
      }
      return res.status(INTERNALSERVERERROR).send({
        message: `Error verifying user with ID ${userId}`,
      });
    }

    return res.status(HTTP200OK).send(data);
  });
};
