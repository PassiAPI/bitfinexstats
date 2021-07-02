const fetch = require('node-fetch')
const url = 'https://api-pub.bitfinex.com/v2/'

const pathParams = 'trades/tBTCUSD/hist' // Change these based on preferred pairs
const queryParams = 'limit=9999&sort=-1&end=1624536000000' // Change these based on relevant query params

const mysql = require('mysql');
const con = mysql.createConnection({

    host: "47.254.133.75",
    user: "bitfinexstats",
    password: "123",
    database: "bitfinexstats"

});

var tradeIDs = [];
var MTSIDs = [];


console.log("Connected!");

async function mysql_insert(ID, MTS, AMOUNT, PRICE) {

    const sql = "INSERT INTO trades (ID, MTS, AMOUNT, PRICE) VALUES (" + ID + "," + MTS + "," + AMOUNT + "," + PRICE + ")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
}

async function mysql_add_tradeID(ID) {

    const sql = "INSERT INTO ids (ID) VALUES (" + ID + ")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 ID added");
    });
}

async function mysql_update_mts(MTS, AMOUNT) {

    const sql = "UPDATE `trades` SET `AMOUNT`=`AMOUNT`+" + AMOUNT + " WHERE `MTS` = " + MTS;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");
    });
}

async function mysql_check_id(ID) {

    con.query("SELECT * FROM trades WHERE ID = " + ID, function (err, result) {

        if (err) throw err;
        if (result.length == 0) {
            return false
        } else {
            return true
        }
    });
}


async function mysql_get_MTSs() {

    con.query("SELECT * FROM trades", function (err, result) {

        if (err) throw err;
        for (let mts of result) {
            MTSIDs.push(mts.MTS)
        }
        console.log(MTSIDs)
    });
}

async function mysql_get_tradeIDs() {

    con.query("SELECT * FROM ids", function (err, result) {

        if (err) throw err;
        for (let id of result) {
            tradeIDs.push(id.ID)
        }
        console.log(tradeIDs)
    });

}

function mysql_get() {

    con.query("SELECT ID FROM trades", function (err, result) {

        if (err) throw err;
        console.log("starting search")
        for (let trade of result) {
            tradeIDs.push(trade.ID)
        }

        console.log(tradeIDs)
    });

}


async function getTrades() {
    try {
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        trades = Array.of(response)[0]

        for (let trade of trades) {

            const id = trade[0]
            const mts = trade[1]
            const amount = trade[2]
            const price = trade[3]

            if (amount > 0.5 || amount < -0.5) {

                if (!tradeIDs.includes(id)) {

                    mysql_add_tradeID(id)

                    if (!MTSIDs.includes(mts)) {

                        mysql_insert(id, mts, amount, price)
                        tradeIDs.push(id)
                        MTSIDs.push(mts)
                    } else {

                        mysql_update_mts(mts, amount)
                        tradeIDs.push(id)
                        console.log(tradeIDs)
                    }
                }


            }
        }
        con.end()
    } catch (err) {
        console.log(err)
    }
}


function main() {

    con.connect(function (err) {
        if (err) throw err;
    });

    mysql_get_tradeIDs()
    mysql_get_MTSs()
    getTrades()
}


if (require.main === module) {
    main();
}



