const express = require("express");
const centralController = require("../controllers/centralController");

const router = express.Router();

//Router

// Main 3 data , temp humidity rainfall
router.get("/main", centralController.getMainData);

// Fire realted data
router.get("/fire", centralController.getFireData);

// Water remaining data
router.get("/waterRemaining", centralController.getWaterLevelData);

module.exports = router;
