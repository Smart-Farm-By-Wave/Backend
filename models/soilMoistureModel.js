const mongoose = require('mongoose');

const soilMoistureSchema = new mongoose.Schema(
    {
        moisture: Number,
        timeStamp: Date,
        farmID: mongoose.Schema.ObjectId
    },
    {
        timeseries: {
            timeField: 'timeStamp',
            metaField: 'farmID',
            granularity: 'seconds',
        },
    }
  );

  const fieldHumidity = mongoose.model('SoilMoisture', soilMoistureSchema)

  module.exports = fieldHumidity