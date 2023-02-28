const mongoose = require("mongoose")
const Central = require("../models/centralModel")

exports.updateCentral = (async (data) => {
    json_data = JSON.parse(data)
    await Central.updateOne({},json_data)
    console.log("Updated central data")
})