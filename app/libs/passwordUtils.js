const crypto = require("crypto");

const hashPassword = (password) => {
  return crypto.createHash("md5").update(password).digest("hex");
};

module.exports = {
  hashPassword,
};
