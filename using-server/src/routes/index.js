const express = require("express");
const router = express.Router();

router.post(
  "/rename",
  require("../controllers/filehandler.controller").renameFile
);

module.exports = router;
