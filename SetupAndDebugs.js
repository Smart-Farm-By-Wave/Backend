const mongoose = require("mongoose")
const dotenv = require("dotenv");
const field = require("./models/fieldModel");
const central = require("./models/centralModel");
const CentralGraph = require("./models/centralGraphModel");
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
        farmID: mongoose.Types.ObjectId("63fdcb958e0315dd1d9a32d5"),
    })
    if(send){
        console.log("sent")
    }
}

const createTimeSeries = async () => {
    await CentralGraph.find()
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

const generateData = async (start,end) => {
    const time = 1677847046757
    for(let i = start; i< end; i++){
        if(i % 500 == 0){
            await SoilMoisture.create({
                moisture: Math.random() * 100,
                timeStamp: time-(i*1000),
                farmID: mongoose.Types.ObjectId("63fdcb958e0315dd1d9a32d5"),
            })
            if(i %5 == 0){
                await CentralGraph.create({
                    timeStamp: time-(i*1000),
                    humidity: Math.random() * 100,
                    temp: 40 - (Math.random() * 20),
                    calcRainAmount: Math.random() * 5
                })
            }
        }
        if(i % 25000 == 0){
            console.log(`${i}`)
        }
    }
    console.log(`Done for ${start} til ${end}`)
}

generateCentral()
generateFields()
genTree()
// generateData(86400, 604800)