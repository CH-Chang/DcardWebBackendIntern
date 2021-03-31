var express = require('express');
var router = express.Router();

// controller
const serviceController = require("../controllers/serviceController");

// middleware
const preventOverloadMiddleware = require("../middleware/preventOverloadMiddleware");

// GET
router.get("/card", [preventOverloadMiddleware], serviceController.draw);

// POST

// PUT

// DELETE

module.exports = router;
