module.exports = (app) => {
  const adminDashboard = require("../controllers/adminDashboard.controller");
  const authToken = require("../middleware/authenticationToken.middleware");
  const router = require("express").Router();

  router.get("/getAllUser", authToken, adminDashboard.getAllUser);
  router.delete("/deleteUser/:user_id", authToken, adminDashboard.deleteUser);
  router.patch("/VerifiedByAdmin", authToken, adminDashboard.VerifiedByAdmin);

  app.use("/api/adminDashboard", router);
};
