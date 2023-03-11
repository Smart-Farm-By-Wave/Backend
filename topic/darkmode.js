const mongoose = require("mongoose")
const Central = require("../models/centralModel")

exports.updateDarkmode = (async (data) => {
    let json_data = JSON.parse(data)
    if(typeof json_data.darkMode != "boolean"){
        console.log("Wrong data type for dark mode.")
        return
    }
    let update = {darkMode: json_data.darkMode}
    await Central.updateOne({},update)
    // console.log("MQTT/central : Updated central data")
})