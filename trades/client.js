const net = require('net');
const readline = require('readline');
let tradeRequest = false;

const client = new net.Socket();
client.connect(59898, process.argv[2], () => {
    console.log('Connected to server');
});
client.on('data', (data) => {
    if (tradeRequest) {
        console.log(data.toArray)
        for (const trade in data) {
            //console.log(trade[1])
        }
    } else {
        console.log(data.toArray);
    }

});
client.on('end', (data) => {
    console.log("DISCONNECT");
});

const rl = readline.createInterface({input: process.stdin});
rl.on('line', (line) => {
    client.write(`${line}`);
    if (line == "getTrades") {
        tradeRequest = true
    }
    if (line == "close") {
        client.end();
    }
});
rl.on('close', () => {

    console.log("stopped")
});