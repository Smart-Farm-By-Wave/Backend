const mqtt = require('mqtt');
const subscribeTo = require('./utils/mqtt');
const moisture = require('./topic/moisture');
const central = require('./topic/central');
const plantStatus = require('./topic/plantStatus');

const subscribedTopic = ["moisture","central","plantStatus"]

// START OF REAL CONNECTION

const host = 'broker.emqx.io'
const MQTTport = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${MQTTport}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

// END OF REAL CONNECTION

// // START OF LOCAL CONNECTION

// const MQTT_SERVER = "0.0.0.0";
// const MQTT_PORT = "1883";
// const MQTT_USER = ""; 
// const MQTT_PASSWORD = "";

// // Connect MQTT
// const client = mqtt.connect({
//     host: MQTT_SERVER,
//     port: MQTT_PORT,
//     username: MQTT_USER,
//     password: MQTT_PASSWORD
// });

// // END OF LOCAL CONNECTION

client.on('connect', function () {
    // Subscribe any topic
    console.log("MQTT Connect");
    subscribeTo(client, subscribedTopic)
});

// Receive Message and print on terminal
client.on('message', async (topic, message) => {
    // message is Buffer

    // Detailed log message from topic
    // console.log(`${topic} : ${message.toString()}`);

    // Simple log 
    console.log(`${topic} has published.`)

    switch(topic) {
        case ("embedded/moisture"):
            res = await moisture.insertNewMoisture(message.toString())
            if(res.ignore != true){
                client.publish(`embedded/watering/${res.index}`, JSON.stringify({
                    activate: res.water
                }));
                console.log(`Also change hardware water to ${res.water}.`)
            }
            break;
        case ("embedded/central"):
            central.updateCentral(message.toString())
            break;
        case ("embedded/plantStatus"):
            plantStatus.insertNewPlantStatus(message.toString())
            break;
    }
});

module.exports = client;