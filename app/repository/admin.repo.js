const sql = require("../libs/db.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const { TOKEN_KEY, TIME_OUT } = require("../libs/constants.js");

const Users = function (user) {
  this.username = user.username;
  this.email = user.email;
  this.admin_id = user.admin_id;
  this.created_at = user.created_at;
  this.updated_at = user.updated_at;
};

Users.createAdminUser = (user, result) => {
  sql.query(
    "SELECT * FROM admin_table WHERE email = ?",
    [user.email],
    (err, existingUsers) => {
      if (err) {
        return result(err, null);
      }

      if (existingUsers.length) {
        return result(null, {
          msg: "User already exists",
          isSuccessful: false,
        });
      }

      const hashedPassword = crypto
        .createHash("md5")
        .update(user.password)
        .digest("hex");

      sql.query(
        "INSERT INTO admin_table (password, email, username,created_at,updated_at) VALUES ( ?, ?, ?,NOW(),NOW())",

        [hashedPassword, user.email, user.username],
        (error, response) => {
          if (error) {
            return result(error, null);
          }
          const admin_id = response.insertId;
          const resObj = {
            msg: "Successfully created",
            isSuccessful: true,
            email: user.email,
            user_type: user.user_type,
            username: user.username,
            admin_id: admin_id,
          };
          const tokenPayload = {
            admin_id: admin_id,
            email: user.email,
          };
          const token = jwt.sign(tokenPayload, TOKEN_KEY);
          resObj.token = token;
          return result(null, resObj);
        }
      );
    }
  );
};

Users.loginByEmailID = (user, result) => {
  sql.query(
    "SELECT admin_id,username, password FROM admin_table WHERE email = ?",
    [user.email],
    (err, res) => {
      if (err) {
        return result(err, null);
      }

      if (res.length > 0) {
        const adminId = res[0].admin_id;
        const storedHashedPassword = res[0].password;

        const inputHashedPassword = crypto
          .createHash("md5")
          .update(user.password)
          .digest("hex");

        if (inputHashedPassword === storedHashedPassword) {
          const token = jwt.sign(
            { admin_id: adminId, username: res[0].username },
            TOKEN_KEY
          );

          return result(null, {
            admin_id: adminId,
            existing: "yes",
            isSuccessful: true,
            token: token,
            user: { admin_id: adminId, username: res[0].username },
          });
        } else {
          return result({ msg: "Password does not match" }, null);
        }
      } else {
        return result({ msg: "Email not found" }, null);
      }
    }
  );
};

module.exports = Users;
