const mongoose = require("mongoose")
const Central = require("../models/centralModel")

exports.updateCentral = (async (data) => {
    let json_data = JSON.parse(data)
    await Central.updateOne({},json_data)
    // console.log("MQTT/central : Updated central data")
})