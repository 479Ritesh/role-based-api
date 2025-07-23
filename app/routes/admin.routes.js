module.exports = app => {
    const adminUser = require("../controllers/admin.controller");
    const auth = require('../middleware/authentication.middleware');
    const router = require("express").Router();

    router.post("/createAdminUser", auth, adminUser.createAdminUser);
    router.post("/loginByEmailID", auth, adminUser.loginByEmailID);

    app.use('/api/adminUser', router);
  };
  


  