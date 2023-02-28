const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
    treeName: {
        type: String,
    },
    recommendedHumidity: {
        type: Number,
    }
})

const Report = mongoose.model('Tree', treeSchema)

module.exports = Report