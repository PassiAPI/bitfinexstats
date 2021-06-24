const fetch = require('node-fetch')
const url = 'https://api-pub.bitfinex.com/v2/'

const pathParams = 'trades/tBTCUSD/hist' // Change these based on preferred pairs
const queryParams = 'limit=9999&sort=-1' // Change these based on relevant query params

var mysql = require('mysql');
var con = mysql.createConnection({

    host: "47.254.133.75",
    user: "bitfinexstats",
    password: "123",
    database: "bitfinexstats"

});

var tradeIDs = []

con.connect(function(err) {
    if (err) throw err;
});



console.log("Connected!");
async function mysql_insert(ID, MTS, AMOUNT, PRICE){

        var sql = "INSERT INTO trades (ID, MTS, AMOUNT, PRICE) VALUES (" + ID + "," + MTS + "," + AMOUNT + "," + PRICE + ")";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
}

async function mysql_check(ID){

        con.query("SELECT * FROM trades WHERE ID = "+ ID, function (err, result) {

            if (err) throw err;
            if(result.length==0){
                return false
            }else{
                return true
            }
        });

}


function mysql_get(){

    con.query("SELECT ID FROM trades", function (err, result) {

        if (err) throw err;
        console.log("starting search")
        for (var trade of result) {
            tradeIDs.push(trade.ID)
        }

        console.log(tradeIDs)
        return tradeIDs
    });
}




async function getTrades() {
    try {
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        trades = Array.of(response)[0]

        for (let trade of trades){

            const id = trade[0]
            const mts = trade[1]
            const amount = trade[2]
            const price = trade[3]

            if(amount > 1 || amount < -1){
                if(!tradeIDs.includes(id)){
                    mysql_insert(id, mts, amount, price)
                    //console.log("INJECTED " + trade)
                }
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}





mysql_get()
getTrades()

