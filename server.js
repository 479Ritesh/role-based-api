const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to rolebasedapi");
});
require("./app/routes/admin.routes")(app);
require("./app/routes/adminDashboard.routes")(app);
require("./app/routes/userLogin.routes")(app);
require("./app/routes/post.routes")(app);
require("./app/routes/comment.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
