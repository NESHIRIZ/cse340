const express = require("express");
const path = require("path");
const router = express.Router();

// Correct static folder setup with absolute path
router.use(express.static(path.join(__dirname, "../public")));

module.exports = router;



