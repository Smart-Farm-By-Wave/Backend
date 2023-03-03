const express = require("express");
const graphController = require("../controllers/graphController");

const router = express.Router();

//Router

// Main 3 data , temp humidity rainfall
router.get("/", graphController.getGraph);

module.exports = router;
