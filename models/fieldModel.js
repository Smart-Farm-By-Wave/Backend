const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    isUsing: {
        type: Boolean,
        required: [true, "A field must state that it is being in use or not."]
    },
    fieldNO: {
        type: Number,
        required: [true, "A field must specify its NO."]
    },
    planter: {
        type: String,
    },
    treeType: {
        type: mongoose.Schema.ObjectId,
        ref: "tree"
    },
    isWatering: {
        type: Boolean,
        default: false
    }
})

const Report = mongoose.model('Field', fieldSchema)

module.exports = Report