const express = require("express");
const fieldController = require("../controllers/fieldController");

const router = express.Router();

//Router

// Get the humidity
router.get("/humidity/:id", fieldController.getHumidity);

// plant name, by who, recommended humidity
router.get("/detail/:id", fieldController.getFarmDetail);

// create new field (Only set using to true)
router.put("/create/:id", fieldController.activateFarm);

// update detail (by who name)
router.put("/update/:id", fieldController.updateFarm);

// remove field (Only set in use to false)
router.put("/remove/:id", fieldController.deleteFarm);

module.exports = router;
