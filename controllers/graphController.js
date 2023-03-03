const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const CentralGraph = require("../models/centralGraphModel")
const SoilMoisture = require("./../models/soilMoistureModel")
const Field = require("./../models/fieldModel")

exports.getGraph = catchAsync(async (req, res, next) => {
    const dataQueried = req.body.data
    const timeQueried = req.body.time

    // Real server use this
    const cur_time = Date.now()

    // For testing use this
    // const cur_time = 1677847046757

    const dataEnum = ["temp","humidity","rainfall","soilMoisture"]
    const timeEnum = ["hour","day","week"]

    let beforeTime = ""
    let interestedField = ""
    let query = {}

    let Collection = CentralGraph

    // Check if the data queried exists

    // Check if the data is valid
    if(!dataEnum.includes(dataQueried)){
        return next(
            new AppError("The data needed is not valid.", 400)
        );
    }

    // Check if the time queried is valid
    if(!timeEnum.includes(timeQueried)){
        return next(
            new AppError("The data needed is invalid.", 400)
        );
    }

    // If the data is soilMoisture check if the field exists
    if (dataQueried === "soilMoisture" && !req.body.field){
        return next(
            new AppError("The field ID is missing to find data for soilMoisture.", 400)
        );
    }

    switch(dataQueried){
        case "temp":
            interestedField = "temp"
            break;
        case "humidity":
            interestedField = "humidity"
            break;
        case "rainfall":
            interestedField = "calcRainAmount"
            break;
        case "soilMoisture":
            interestedField = "moisture"
            Collection = SoilMoisture
            break;
    }

    let aggregate = {}
    time = []
    data = []

    switch(timeQueried){

        case "hour":
            
            beforeTime = new Date(cur_time-3600000).toISOString()
            if(dataQueried === "soilMoisture"){
                // Find the farm ID from the index
                const farm = await Field.findOne({fieldNO: req.body.field}).exec()
                if(!farm){
                    return next(
                        new AppError("No farm data exists yet or invalid ID.", 400)
                    );
                }

                query = { $match : {"timeStamp" : {$gt : new Date(beforeTime)} , "farmID" : farm._id}}
                console.log(query)
                
            } else {
                query = { $match : {"timeStamp" : {$gt : new Date(beforeTime)}}}
            }
            aggregate = await Collection.aggregate([
                query,
                { $set : {
                    minute : { $minute : { date : "$timeStamp" , timezone: "+07" }},
                    hour : { $hour : { date : "$timeStamp" , timezone: "+07" }},
                }},
                { $set : {minute : { $floor : { $divide : [ "$minute" , 5 ]}}}},
                { $set : {minute : { $multiply : [ "$minute" , 5 ]}}},
                { $group : { 
                    _id : {hour : "$hour", minute : "$minute"}, 
                    average : {$avg : `$${interestedField}`}}
                },
                { $sort : {_id : 1}}
            ])

            for(el of aggregate){
                time.push(`${el._id.hour}:${el._id.minute}`)
                data.push(el.average)
            }

            break;

        case "day":

            beforeTime = new Date(cur_time-86400000).toISOString()

            if(dataQueried === "soilMoisture"){
                // Find the farm ID from the index
                const farm = await Field.findOne({fieldNO: req.body.field}).exec()
                if(!farm){
                    return next(
                        new AppError("No farm data exists yet or invalid ID.", 400)
                    );
                }

                query = { $match : {"timeStamp" : {$gt : new Date(beforeTime)} , "farmID" : farm._id}}
                console.log(query)
                
            } else {
                query = { $match : {"timeStamp" : {$gt : new Date(beforeTime)}}}
            }

            aggregate = await Collection.aggregate([
                query,
                { $set : {
                    hour : { $hour : { date : "$timeStamp" , timezone: "+07" }},
                    day : { $dayOfMonth : { date : "$timeStamp" , timezone: "+07" }},
                    month : { $month : { date : "$timeStamp" , timezone: "+07" }},
                    year : { $year : { date : "$timeStamp" , timezone: "+07" }}
                }},
                { $group : { 
                    _id : { year : "$year" , month : "$month" , day : "$day", hour : "$hour",}, 
                    average : {$avg : `$${interestedField}`}}
                },
                { $sort : {_id : 1}}
            ])

            for(el of aggregate){
                time.push(`${el._id.day}.${el._id.month}.${el._id.year} - ${el._id.hour}:00`)
                data.push(el.average)
            }
            break;

        case "week":

            beforeTime = new Date(cur_time-604800000).toISOString()

            if(dataQueried === "soilMoisture"){
                // Find the farm ID from the index
                const farm = await Field.findOne({fieldNO: req.body.field}).exec()
                if(!farm){
                    return next(
                        new AppError("No farm data exists yet or invalid ID.", 400)
                    );
                }

                query = { $match : {"timeStamp" : {$gt : new Date(beforeTime)} , "farmID" : farm._id}}
                console.log(query)
                
            } else {
                query = { $match : {"timeStamp" : {$gt : new Date(beforeTime)}}}
            }

            aggregate = await Collection.aggregate([
                query,
                { $set : {
                    day : { $dayOfMonth : { date : "$timeStamp" , timezone: "+07" }},
                    month : { $month : { date : "$timeStamp" , timezone: "+07" }},
                    year : { $year : { date : "$timeStamp" , timezone: "+07" }},
                    hour : { $hour : { date : "$timeStamp" , timezone: "+07" }},
                }},
                { $set : {hour : { $floor : { $divide : [ "$hour" , 12 ]}}}},
                { $set : {hour : { $multiply : [ "$hour" , 12 ]}}},
                { $group : { 
                    _id : { year : "$year" , month : "$month" , day : "$day" , hour : "$hour"}, 
                    average : {$avg : `$${interestedField}`}}
                },
                { $sort : {_id : 1}}
            ])

            for(el of aggregate){
                time.push(`${el._id.day}.${el._id.month}.${el._id.year} - ${el._id.hour}:00`)
                data.push(el.average)
            }
            break;
    }

    res.status(201).json({
        status: "success",
        data: {
            time : time,
            data : data
        }
    });
})