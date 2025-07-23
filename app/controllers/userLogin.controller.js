const Users = require('../repository/userLogin.repo');
const crypto = require('crypto');

const {
  INTERNALSERVERERROR,
  HTTP200OK,
  BADREQUEST,
  Unauthorized,
  NOTFOUND
} = require('../libs/httpcode');


function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

exports.createUser = (req, res) => {
  if (!req.body) {
    return res.status(BADREQUEST).send({
      message: "Incomplete request."
    });
  }

  const { email, password, username } = req.body;
  if (!email) {
    return res.status(BADREQUEST).send({
      message: "Email is required."
    });
  }
  if (!password) {
    return res.status(BADREQUEST).send({
      message: "Password is required."
    });
  }
  if (!username) {
    return res.status(BADREQUEST).send({
      message: "Username is required."
    });
  }


  const user = {
    email: email,
    password: md5(password),
    username: username
  };

  

  Users.createUser(user, (err, data) => {
    if (err) {
      res.status(INTERNALSERVERERROR).send({
        message: err.message || "Some error occurred while creating the user."
      });
    } else {
      res.status(HTTP200OK).send(data);
    }
  }, device_id);
};

exports.loginByEmailID = (req, res) => {
  if (!req.body) {
    return res.status(BADREQUEST).send({ message: "Request body is missing." });
  }

  if (!req.body.email) {
    return res.status(BADREQUEST).send({ message: "Email is required." });
  }

  if (!req.body.password) {
    return res.status(BADREQUEST).send({ message: "Password is required." });
  }

  const user = {
    email: req.body.email,
    password: md5(req.body.password),
  };

  Users.loginByEmailID(user, (err, data) => {
    if (err) {
      if (["Incorrect email", "Incorrect password", "Email not found"].includes(err)) {
        return res.status(Unauthorized).send({
          isSuccessful: false,
          message: "Incorrect email or password.",
        });
      }

      return res.status(INTERNALSERVERERROR).send({
        isSuccessful: false,
        message: "An unknown error occurred.",
      });
    } else {
      return res.status(HTTP200OK).send(data);
    }
  });
};


