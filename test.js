const mqtt = require('mqtt');

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

const lmao = {
    index: 1,
    moisture: 20
}
// console.log(lmao.toString())
setInterval(() => {
    client.publish("embedded/moisture", JSON.stringify(lmao));
}, 1000);