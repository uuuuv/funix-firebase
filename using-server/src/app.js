require("dotenv").config();
const express = require("express");
const app = express();

app.use(require("./middlewares/cors.middleware"));
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(express.json());

app.use("/file", require("./routes"));

// init firebase-admin SDKs
require("./utils/firebaseAdminSDKs.util");

app.listen(5000, () => {
  console.log("server is running.");
});
