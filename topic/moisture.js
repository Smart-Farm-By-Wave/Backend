const SoilMoisture = require("../models/soilMoistureModel")
const Field = require("../models/fieldModel")
const Tree = require("../models/treeModel")

exports.insertNewMoisture = async (data) => {
    let json_data = JSON.parse(data)
    // console.log(json_data)
    // console.log(json_data.index)

    if(json_data.moisture <= 0){
        return
    }

    farm = await Field.findOne({fieldNO: json_data.index})
    tree = await Tree.findById(farm.treeType)

    res = {
        index: json_data.index,
        ignore: true
    }

    send = await SoilMoisture.create({
        moisture: json_data.moisture,
        timeStamp: Date.now(),
        farmID: farm._id
    })

    // console.log(farm.isWatering, tree.recommendedHumidity, json_data.moisture)

    // CALC THE WATER AND THEN PEW PEW IF NEEDED
    if(!farm.isWatering && (tree.recommendedHumidity > json_data.moisture)){
        res.water = true
        res.ignore = false

        // TELL TO WATER PLANTS
        await Field.updateOne(farm, {
            isWatering : true
        })

    } else if (farm.isWatering && (tree.recommendedHumidity < json_data.moisture)){
        // ELSE TELL STOP WATER PLANTS
        res.water = false
        res.ignore = false

        await Field.updateOne(farm, {
            isWatering : false
        })
    }
    // console.log(res)
    // console.log(`MQTT/moisture : updated field NO.${json_data.index}`)
    return res
}