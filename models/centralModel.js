const mongoose = require('mongoose');

const centralSchema = new mongoose.Schema({
    fire: {
        type: Boolean,
        default: false
    },
    smoke: {
        type: Boolean,
        default: false
    },
    waterLevel: {
        type: Number
    }
})

const Report = mongoose.model('Central', centralSchema)

module.exports = Report