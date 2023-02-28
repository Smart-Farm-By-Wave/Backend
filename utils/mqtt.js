const mqtt = require('mqtt');

module.exports = (client, topic) => {
    for (let el of topic){
        client.subscribe(`embedded/${el}`, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(`topic : embedded/${el} is connected.`)
            }
        });
    }
}