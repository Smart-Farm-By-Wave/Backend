const SoilMoisture = require("./models/soilMoistureModel")
const mongoose = require("mongoose")
const Field = require("./models/fieldModel")

const testAddONe = async() => {
    await SoilMoisture.create({
        moisture: 10,
        timeStamp: Date.now(),
        farmID: mongoose.Types.ObjectId("63fdad1e44b913e7e19dc85c")
    })
}

const testAddwe = async() => {
    await Field.create({
        isUsing: true
    })
}

testAddwe()
// setInterval(testAddONe, 1000);