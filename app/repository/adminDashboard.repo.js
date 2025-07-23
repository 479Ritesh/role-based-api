const sql = require("../libs/db.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const { TOKEN_KEY, TIME_OUT } = require("../libs/constants.js");


const Users = function (user) {
    this.username = user.username;
    this.emailId = user.emailId;
    this.admin_id = user.admin_id;
  
};

Users.getAllUser = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      const formattedResult = res.map(user => ({
        user_id: user.user_id , 
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      }));
      result(null, formattedResult);
    } else {
      result({ kind: "not_found" }, null);
    }
  });
};

Users.deleteUser = (user_id, result) => {
  sql.query(
      "DELETE FROM users WHERE user_id = ?",
      [user_id],
      (err, res) => {
          if (err) {
              result(err, null);
              return;
          }

                  result(null, { message: "Successfully deleted User" });
              });
};

Users.VerifiedByAdmin = (user_id, result) => {
  sql.query(
      "UPDATE `users` SET isVerified = 1 WHERE user_id = ?",
      [user_id],
      (err, res) => {
          if (err) {
              result(err, null);
              return;
          }

          if (res.affectedRows == 0) {
              result({ kind: "not_found" }, null);
              return;
          }

          result(null, { isSuccessful: true, msg: 'updated successfully' });
          return;
      }
  );
};

module.exports = Users;