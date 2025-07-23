const Users = require("../repository/admin.repo");
const {
  INTERNALSERVERERROR,
  HTTP200OK,
  BADREQUEST,
} = require("../libs/httpcode");

exports.createAdminUser = (req, res) => {
  if (!req.body) {
    return res.status(BADREQUEST).send({
      message: "Incomplete request.",
    });
  }

  const { email, password, username } = req.body;
  if (!email) {
    return res.status(BADREQUEST).send({ message: "email is required." });
  }
  if (!password) {
    return res.status(BADREQUEST).send({ message: "Password is required." });
  }
  if (!username) {
    return res.status(BADREQUEST).send({ message: "Username is required." });
  }

  const user = {
    email,
    password,
    username,
  };
  Users.createAdminUser(user, (err, data) => {
    if (err) {
      return res.status(INTERNALSERVERERROR).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    }
    return res.status(HTTP200OK).send(data);
  });
};

exports.loginByEmailID = (req, res) => {
  if (!req.body) {
    return res.status(BADREQUEST).send({
      message: "Content can not be empty!",
    });
  }
  if (!req.body.email) {
    return res.status(BADREQUEST).send({
      message: "email can not be empty!",
    });
  }
  if (!req.body.password) {
    return res.status(BADREQUEST).send({
      message: "password can not be empty!",
    });
  }

  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  Users.loginByEmailID(user, (err, data) => {
    if (err) {
      const statusCode =
        err.msg === "Email not found" ? 401 : INTERNALSERVERERROR;
      return res.status(statusCode).send({
        isSuccessful: false,
        message: err.msg || "Invalid email or password.",
      });
    }

    return res.status(HTTP200OK).send(data);
  });
};
