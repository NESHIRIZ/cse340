const express = require("express");
const router = express.Router();

// Correct static folder setup
router.use(express.static("public"));

module.exports = router;



