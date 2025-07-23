const sql = require("../libs/db.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const { TOKEN_KEY, TIME_OUT } = require("../libs/constants.js");

const Users = function (user) {
  this.username = user.username;
  this.emailId = user.emailId;
  this.userId = user.userId;
  this.isVerified = user.isVerified;
};

Users.getAllUser = (result) => {
  const query = "SELECT userId, username, email, isVerified FROM users";

  sql.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }

    if (!res.length) {
      return result({ kind: "not_found" }, null);
    }

    const users = res.map((user) => ({
      userId: user.userId,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
    }));

    result(null, users);
  });
};

Users.deleteUser = (userId, result) => {
  sql.query("DELETE FROM users WHERE userId = ?", [userId], (err, res) => {
    if (err) {
      return result(err, null);
    }

    sql.query("DELETE FROM posts WHERE userId = ?", [userId], (err, res) => {
      if (err) {
        return result(err, null);
      }

      sql.query(
        "DELETE FROM  comments WHERE userId = ?",
        [userId],
        (err, res) => {
          if (err) {
            return result(err, null);
          }

          result(null, {
            isSuccessful: true,
            message: "Successfully deleted user and related posts/comments.",
          });
        }
      );
    });
  });
};

Users.VerifiedByAdmin = (userId, result) => {
  const query = "UPDATE users SET isVerified = 1 WHERE userId = ?";

  sql.query(query, [userId], (err, res) => {
    if (err) {
      return result(err, null);
    }

    if (res.affectedRows === 0) {
      return result({ kind: "not_found" }, null);
    }

    result(null, {
      isSuccessful: true,
      message: "User verified successfully.",
    });
  });
};

module.exports = Users;
