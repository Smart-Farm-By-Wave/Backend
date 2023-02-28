const mongoose = require("mongoose")
const dotenv = require("dotenv");
const field = require("./models/fieldModel");
const central = require("./models/centralModel");
const SoilMoisture = require("./models/soilMoistureModel")
const Tree = require("./models/treeModel")

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );
  
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB connection successful");
    });
  
const generateFields = async () => {
    for(let i=0; i<4; i++){
        await (field.create(
            {
                isUsing: false,
                fieldNO: i+1,
                treeType: mongoose.Types.ObjectId("63fdc935d46a3b752135d6ef")
            }
        ))
        console.log(`generated field ${i}`)
    }
}

const generateCentral = async () => {
    await central.create({
        waterLevel: 0
    })
}

const testAddONe = async() => {
    send = await SoilMoisture.create({
        moisture: Math.random() * 100,
        timeStamp: Date.now(),
        farmID: mongoose.Types.ObjectId("63fdad1e44b913e7e19dc85c"),
    })
    if(send){
        console.log("sent")
    }
}

const createTimeSeries = async () => {
    await SoilMoisture.find()
}

const genTree = async () => {
    await Tree.create({
        treeName: "kakao tree",
        recommendedHumidity: 50
    })
}

const genUpdateTree = async () => {
    await Tree.updateOne({
        treeName: "kakao tree"
    }, {
        recommendedHumidity: 20
    })
}


// generateCentral()
generateFields()
// setInterval(testAddONe, 1000);
// genTree()