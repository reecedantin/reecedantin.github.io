'use strict';

var temperature;
var weatherDescription;
var image;
var forcast;
var wNow;
var wNext = [];
var wImg = [];
var weatherResponse;

function setupWeather() {
    fetchResults((error, response) => {
        if (error) {
            console.log(error)
        } else {
            weatherResponse = response.properties.periods[0].startTime;
            temperature = document.createElement('temperature');
            temperature.innerHTML = response.properties.periods[0].temperature + 'º F'
            document.body.appendChild(temperature)

            weatherDescription = document.createElement('weatherDescription');

            weatherDescription.innerHTML = response.properties.periods[0].shortForecast
            document.body.appendChild(weatherDescription)


            image = document.createElement('img');
            image.src = response.properties.periods[0].icon
            document.body.appendChild(image)
            console.log(response)


            var forcast = document.createElement('embed');
            forcast.src = "https://embed.windy.com/embed2.html?lat=33.773&lon=-84.418&zoom=10&level=surface&overlay=radar&menu=false&message=false&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&detailLat=47.680&detailLon=-122.121&metricWind=default&metricTemp=default"
            if(response.properties.periods[0].shortForecast.indexOf("Rain") != -1 || response.properties.periods[0].shortForecast.indexOf("Shower") != -1 || response.properties.periods[0].shortForecast.indexOf("Thunderstorm") != -1){
                document.body.appendChild(forcast)
                weatherDescription.style.width = "700px";
            }

            for(var i = 0; i < 5; i ++) {
                wNext[i] = document.createElement('smalltemperature');
                wNext[i].innerHTML = response.properties.periods[i + 1].temperature
                wNext[i].style.top = "900px"
                wNext[i].style.left =  (291 + (300 * i)) + "px"
                document.body.appendChild(wNext[i])

                console.log(response.properties.periods[i + 1].temperature)

                wNext[i] = document.createElement('smalltemperature');
                var date = new Date(response.properties.periods[i + 1].startTime);

                var hourtext = "";

                if(date.getHours() == 0) {
                    hourtext = "12am"
                } else if (date.getHours() < 12) {
                    hourtext = date.getHours() + "am"
                } else if (date.getHours() == 12) {
                    hourtext = date.getHours() + "pm"
                } else if (date.getHours() > 12) {
                    hourtext = (date.getHours() - 12) + "pm"
                }


                wNext[i].innerHTML = hourtext;
                wNext[i].style.top = "1030px"
                wNext[i].style.right =  (1520 - (300 * i)) + "px"
                wNext[i].style.fontSize = "2vw";
                document.body.appendChild(wNext[i])

                wImg[i] = document.createElement('img');
                wImg[i].src = response.properties.periods[i + 1].icon
                wImg[i].style.top = "810px"
                wImg[i].style.left = (320 + (300 * i)) + "px"
                document.body.appendChild(wImg[i])

            }

            drawLines();
        }
    });
}

function fetchResults(callback) {
    //https://api.weather.gov/alerts/active/zone/GAZ044
    fetch('https://api.weather.gov/points/33.7717008,-84.3726049/forecast/hourly')
       .then(response => response.json())
       .then(json => callback(null, json))
       .catch(error => callback(error, null))
}


function drawLines() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var widthfactor = 300;

    // begin custom shape
    context.beginPath();
    for(var i = 0; i < 6; i ++) {
        context.moveTo((1920/2 - (widthfactor*(2*(i-2) - 1)/2)), 800);
        context.lineTo((1920/2 - (widthfactor*(2*(i-2) - 1)/2)), 1100);
    }

    // complete custom shape
    context.closePath();
    context.lineWidth = 2;
    context.strokeStyle = '#e1e1e1';
    context.stroke();
}

function updateWeather() {
    fetchResults((error, response) => {
        if(weatherResponse != response.properties.periods[0].startTime) {
            location.reload();
        }
    })
}

setupWeather();
setInterval(updateWeather, 20000);
