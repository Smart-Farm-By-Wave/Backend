const CentralGraph = require("../models/centralGraphModel")

// const maxHardwareRainHeight = 5
// const maxHardwareRainData = 1000
// const hardwareRatio = maxHardwareRainHeight/maxHardwareRainData

exports.insertNewPlantStatus = async (data) => {
    let json_data = JSON.parse(data)
    json_data.timeStamp = Date.now()
    // console.log(`in = ${json_data}`)
    
    // FIX RAIN AMOUNT
    // const newest = await CentralGraph.find().sort({ timeStamp: -1 }).limit(1)
    // console.log(json_data.rainAmount)

    // Alternative formula
    const date = new Date(Date.now() - 1000*60*60*24)
    let query = { $match : {"timeStamp" : {$gt : new Date(Date.now() - 1000*60*60*24*3)}}}
    let aggregate = await CentralGraph.aggregate([
        query,
        { $set : {
            day : { $dayOfMonth : { date : "$timeStamp" , timezone: "+07" }}
        }},
        { $match: {"day" : date.getDate()}},
        { $sort : {timeStamp : -1}}
    ])

    const newestRain = aggregate[0].rainAmount

    let newCalcRain = (json_data.rainAmount - newestRain)
    
    if(newCalcRain < 0 || newCalcRain == NaN){
        newCalcRain = 0
    }

    json_data.calcRainAmount = newCalcRain
    // console.log(json_data)

    await CentralGraph.create(json_data)

    // console.log("MQTT/plantStatus: Updated plant status data")
}