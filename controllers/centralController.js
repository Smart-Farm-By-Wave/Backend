const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const CentralGraph = require("../models/centralGraphModel")
const Central = require("../models/centralModel")

exports.getMainData = catchAsync(async (req, res, next) => {
    // find the latest 3 datas
    const newest = (await CentralGraph.find().sort({ timeStamp: -1 }).limit(1))[0]
    if(!newest){
        return next(
            new AppError("No data exists yet.", 400)
          );
    }

    res.status(201).json({
        temp: newest.temp,
        humidity: newest.humidity,
        rainfall: newest.calcRainAmount
      });
})

exports.getFireData = catchAsync(async (req, res, next) => {
    // find the latest fire data
    const newest = (await Central.findOne())
    if(!newest){
        return next(
            new AppError("No data exists yet.", 400)
          );
    }

    res.status(201).json({
        fire: newest.fire,
        smoke: newest.smoke,
      });
})

exports.getWaterLevelData = catchAsync(async (req, res, next) => {
    // find the latest water level data
    const newest = (await Central.findOne())
    if(!newest){
        return next(
            new AppError("No data exists yet.", 400)
          );
    }

    res.status(201).json({
        amount: newest.waterLevel,
      });
})