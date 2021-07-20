async function getFunding(start) {
    try {

        const pathParams = 'fundingRate' // Change these based on relevant path params
        const queryParams = 'symbol=BTCUSDT&limit=1000&startTime=' + start // Change these based on relevant query params
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        console.log(response)
        return (response)

    } catch (err) {
        console.log(err)
    }

}

async function load() {

    const data = {
        labels: lab,
        datasets: [{
            data: dat,
        }]
    };


    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {

                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    }
                },

                legend: false,
            },
            elements: {
                bar: {
                    borderWidth: 2,
                    borderColor: "rgb(54, 162, 235)"
                }
            }
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );


}

const url = 'https://www.binance.com/fapi/v1'


async function createData() {
    var start = 1


    for (let e=0; e<3; e++){
        response = await getFunding(start)
        start = await ((response[response.length - 1])['fundingTime'])
        await console.log(start)
        for (i = 0; i < response.length; i++) {
            await dat.push((response[i])['fundingRate'])
        }
        console.log("done")
    }


/*
    response = await getFunding(start)
    await console.log((response[response.length - 1])['fundingTime'])
    for (i = 0; i < response.length; i++) {
        await dat.push((response[i])['fundingRate'])
    }


 */

}


async function createLabels() {

    for (i = 0; i < (dat.length + 500); i++) {
        await lab.push(i)

    }


}

var lab = []
var dat = []

async function main() {
    await createData()
    await createLabels()

    await load()
    console.log(lab)
    console.log(dat)


}

main()


