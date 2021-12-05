const currentUrl = window.location.href;

let graphCount = 0;

let charts = []

function addGraph() {
    let coin = document.getElementById('coinselect').value;
    let interval = document.getElementById('interval').value;
    let data_points = document.getElementById('datapoints').value;

    document.getElementById("content").innerHTML = `
    <div id="chartcontainer${graphCount}">
    <h2 class="text-center">${coin}</h2>
    <button class="btn btn-danger mb-2 text-right" onclick="remGraph('chartcontainer${graphCount}')">X</button>
    <canvas id="chart${graphCount}" width="400" height="400"></canvas>
    </div>
    ` + document.getElementById("content").innerHTML;
    let chart = {
        id: `chartcontainer${graphCount}`,
        chart: `chart${graphCount}`,
        c: coin,
        i: interval,
        d: data_points
    }
    charts.push(chart)
    charts.forEach(ch => {
        drawChart(ch.chart, ch.c, ch.d, ch.i);
    });
    graphCount++;
}

function remGraph(id) {
    let element = document.getElementById(id);
    let remove = -1;
    charts.forEach((ch, index) => {
        if (ch.id == id)
            remove = index;
    });
    element.parentNode.removeChild(element);
    charts.splice(remove, 1);
}

function getData(coin, data_points, interval) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: `https://api.lunarcrush.com/v2?data=assets&key=5kh3il7x10l2mk64va5jii&symbol=${coin}&data_points=${data_points}&interval=${interval}`,
            type: "GET",
            success: function(result) {
                resolve(result);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

function drawChart(chart, coin, data_points, interval) {
    getData(coin, data_points, interval).then(result => {
        let dataset = JSON.parse(result);
        let dataarr = [];
        let labelarr = [];
        for (let i = 0; i < dataset.data[0].timeSeries.length; i++) {
            dataarr.push((dataset.data[0].timeSeries[i].high + dataset.data[0].timeSeries[i].low) / 2);
            const date = new Date(dataset.data[0].timeSeries[i].time * 1000);
            const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"
            ];
            const hourstr = date.getHours() > 9 ? `${date.getHours()}` : `0${date.getHours()}`;
            const minutestr = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
            labelarr.push(`${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()} ${hourstr}:${minutestr}`);
        }

        const ctx = document.getElementById(chart).getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelarr,
                datasets: [{
                    label: 'Price',
                    data: dataarr,
                    backgroundColor: [
                        'rgba(0, 0, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(0, 0, 255, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        //beginAtZero: true
                    }
                }
            }
        });
    }, reason => {
        console.error(reason);
    });
}