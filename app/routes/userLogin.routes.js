module.exports = (app) => {
  const users = require("../controllers/userLogin.controller");
  const auth = require("../middleware/authentication.middleware");
  const authToken = require("../middleware/authenticationToken.middleware");

  var router = require("express").Router();

  router.post("/createUser", auth, users.createUser);
  router.post("/loginByEmailID", auth, users.loginByEmailID);

  app.use("/api/users/login", router);
};
