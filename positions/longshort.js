"use strict"

const fetch = require(`node-fetch`)
const url = 'https://api-pub.bitfinex.com/v2/'

function getNumber(number){
    return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);

}

async function getPairs(){
    try{
        const req = await fetch(`${url}/conf/pub:list:pair:margin`)
        const response = await req.json()
        console.log((response[0]))
        return response[0]
    }
    catch (err) {
        console.log(err)
    }
}

async function getPrice(ticker){
    try {
        const pathParams = 'ticker/'+ticker // Change these based on relevant path params
        const queryParams = '' // Change these based on relevant query params
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        return response[0]
    }
    catch (err) {
        console.log(err)
    }
}

async function getAmount(ticker, side) {
    try {
        const pathParams = 'stats1/pos.size:1m:' + ticker + ':' + side +'/last'
        const queryParams = ''
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        return(response[1])
    }
    catch (err) {
        console.log(err)
    }
}

async function getLongShort(ticker, debug=true){
    const longs = await getAmount(ticker, 'long')
    const shorts = await getAmount(ticker, 'short')
    const price = await getPrice(ticker)
    const longsUSD = longs * price
    const shortsUSD = shorts * price
    const longShort = longsUSD / shortsUSD;

    if(debug){
        console.log(ticker + " LONGS : " + getNumber(longsUSD))
        console.log(ticker + " SHORTS : " + getNumber(shortsUSD))
        console.log(ticker + " LONG/SHORT : " + longShort)
    }

    return longShort
}


async function checktickers(usd=false){
    const tickers = await getPairs()
    for (let ticker of tickers){
        if(usd){
            if(!(ticker[ticker.length-1] == "D")){

                continue

            }

        }

        const longShort = await getLongShort('t'+ticker, false)
        if(longShort < 0.8){
            console.log(ticker + " : " + longShort)
        }
    }
}


//getLongShort("tADAUST")

checktickers(true)



