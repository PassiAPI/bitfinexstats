const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/chart.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);


const fetch = require(`node-fetch`)
const url = 'https://www.binance.com/fapi/v1'


async function getFunding() {
    try {
        const pathParams = 'fundingRate' // Change these based on relevant path params
        const queryParams = 'symbol=BTCUSDT&limit=2' // Change these based on relevant query params
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        console.log(response)
        return response[5]
    } catch (err) {
        console.log(err)
    }
}
