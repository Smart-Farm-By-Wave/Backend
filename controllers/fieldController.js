const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const SoilMoisture = require("./../models/soilMoistureModel")
const Field = require("./../models/fieldModel")
const Tree = require("./../models/treeModel")

exports.getMoisture = catchAsync(async (req, res, next) => {
    // Find the farm ID from the index
    const farm = await Field.findOne({fieldNO: req.params.id}).exec()
    if(!farm){
        return next(
            new AppError("No farm data exists yet or invalid ID.", 400)
          );
    }

    // Find the latest soil moisture with the provided id
    const moisture = (await SoilMoisture.find({farmID:farm._id}).sort({ timeStamp: -1 }).limit(1))[0]
    if(!moisture){
        return next(
            new AppError("No moisture data exists yet.", 400)
          );
    }

    res.status(201).json({
        moisture:moisture.moisture
      });
})

exports.getFarmDetail = catchAsync(async (req, res, next) => {
    // Find the farm ID from the index
    const farm = await Field.findOne({fieldNO: req.params.id}).select({_id:0, __v:0, fieldNO:0, isWatering:0}).lean()
    if(!farm){
        return next(
            new AppError("No farm data exists yet or invalid ID.", 400)
          );
    }

    // Find the tree name from the tree ID
    const tree = await Tree.findById(farm.treeType)
    if(!tree){
        return next(
            new AppError("No tree data exists yet or invalid tree ID.", 400)
          );
    }

    res.status(201).json({
        isUsing: farm.isUsing,
        plantName: tree.treeName,
        byWho: farm.planter
      })
})

exports.activateFarm = catchAsync(async (req, res, next) => {
    // Find the tree ID
    const tree = await Tree.findOne({treeName: req.body.plantName})
    if(!tree){
        return next(
            new AppError("No tree data exists yet or invalid tree ID.", 400)
          );
    }

    // Prepare for the update
    const query = {
        fieldNO: req.params.id, 
        isUsing: false
    }
    const updateData = {
        isUsing: true,
        planter: req.body.byWho,
        treeType: tree._id
    }

    // Check if the query exists
    const test = await Field.findOne(query)
    if(!test){
        return next(
            new AppError("Farm creation failed. Maybe the farm is already activated or invalid id?", 400)
          );
    }
    
    await Field.updateOne(query, updateData)
    
    res.status(201).json({
        result: "success"
      });
})

exports.updateFarm = catchAsync(async (req, res, next) => {
    // Prepare for the update
    const query = {
        fieldNO: req.params.id, 
        isUsing: true
    }
    const updateData = {
        planter: req.body.byWho
    }

    // Check if the query exists
    const test = await Field.findOne(query)
    if(!test){
        return next(
            new AppError("Farm update failed. Maybe the farm has not been activated or invalid id?", 400)
          );
    }
    
    await Field.updateOne(query, updateData)
    
    res.status(201).json({
        result: "success"
      });
})

exports.deleteFarm = catchAsync(async (req, res, next) => {
    // Should we delete past records too?

    // Prepare for the update
    const query = {
        fieldNO: req.params.id, 
        isUsing: true
    }
    
    // Check if the query exists
    const test = await Field.findOne(query)
    if(!test){
        return next(
            new AppError("Farm update failed. Maybe the farm has not been activated or invalid id?", 400)
          );
    }

    // Prepare for delete query

    const deleteQuery = {
        farmID: test._id
    }
    
    await Field.updateOne(query, { isUsing: false, $unset: { planter: 1, treeType: 1} })
    await SoilMoisture.deleteMany(deleteQuery)

    res.status(201).json({
        result: "success"
      });
})