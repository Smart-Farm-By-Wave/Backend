const Field = require("../models/fieldModel");

exports.resetServer = async () => {
    let update = {
        isWatering: false
    }
    await Field.updateMany({},update)
}