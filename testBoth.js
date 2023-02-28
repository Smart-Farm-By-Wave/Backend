const express = require("express");
const mqtt = require('mqtt');

const MQTT_SERVER = "0.0.0.0";
const MQTT_PORT = "1883";
//if your server don't have username and password let blank.
const MQTT_USER = ""; 
const MQTT_PASSWORD = "";

// Connect MQTT
const client = mqtt.connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,
    username: MQTT_USER,
    password: MQTT_PASSWORD
});

client.on('connect', function () {
    // Subscribe any topic
    console.log("MQTT Connect");
    client.subscribe('test', function (err) {
        if (err) {
            console.log(err);
        }
    });
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(`${topic} : ${message.toString()}`);
});

const app = express();

port = 5000
app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
  });

app.get('/', (req, res, next) => {
    res.status(200).json({
        status: "success",
      });
})