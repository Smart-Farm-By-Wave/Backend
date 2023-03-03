const mongoose = require('mongoose');

const centralGraphSchema = new mongoose.Schema(
    {
        timeStamp: Date,
        humidity: Number,
        temp: Number,
        rainAmount: Number,
        calcRainAmount: Number
    },
    {
        timeseries: {
            timeField: 'timeStamp',
            granularity: 'seconds',
        },
    }
  );

  const fieldHumidity = mongoose.model('CentralGraph', centralGraphSchema)

  module.exports = fieldHumidity