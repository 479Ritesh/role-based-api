const sql = require("../libs/db.js");
const jwt = require('jsonwebtoken');
const Users = require("../libs/constructor.js");
const { TOKEN_KEY, TIME_OUT } = require("../libs/constants.js");

Users.createUser = (user, result) => {
    sql.query(
        "SELECT * FROM users WHERE email = ?",
        user.email,
        (err, res) => {
            if (err) {
                return result(err, null);
            }
            if (res.length) {
                return result(null, {
                    msg: "Email already exists",
                    isSuccessful: false,
                });
            }
            sql.query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [user.username, user.email, user.password],
                (error, response) => {
                    if (error) {
                        return result(error, null);
                    }
                    const user_id = response.insertId;
                    const resObj = {
                        msg: 'Successfully created',
                        isSuccessful: true,
                        email: user.email,
                        username: user.username,
                        user_id: user_id,
                    };
                    const tokenPayload = {
                        user_id: user_id,
                        email: user.email,
                    };
                    const token = jwt.sign(
                        tokenPayload,
                        TOKEN_KEY,
                        {
                            expiresIn: TIME_OUT,
                        }
                    );
                    resObj.token = token;
                    return result(null, resObj);
                }
            );
        }
    );
};


Users.loginByEmailID = (user, result) => {
    sql.query(
      "SELECT * FROM users WHERE email = ?",
      [user.email],
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
  
        if (res.length) {
          const userData = res[0];
  
          if (user.password === userData.password) {
            const token = jwt.sign(
              {
                user_id: userData.user_id,
                email: userData.email,
              },
              TOKEN_KEY,
              { expiresIn: TIME_OUT }
            );
  
            const response = {
              user_id: userData.user_id,
              username: userData.username,
              email: userData.email,
              token: token,
            };
  
            result(null, response);
          } else {
            result("Incorrect password", null);
          }
        } else {
          result("Email not found", null);
        }
      }
    );
  };
  
module.exports = Users;