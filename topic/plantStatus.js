const SoilMoisture = require("../models/soilMoistureModel")
const CentralGraph = require("../models/centralGraphModel")

exports.insertNewPlantStatus = async (data) => {
    json_data = JSON.parse(data)
    json_data.timeStamp = Date.now()
    console.log(json_data)
    await CentralGraph.create(json_data)

    // FIX RAIN AMOUNT
    // OR COLLECT AS LOG AND THEN CALC USING A FORMULAR LATER which might be the way
    // since we need past rainfall data

    console.log("Updated plant status data")
}