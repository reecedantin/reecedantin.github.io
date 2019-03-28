'use strict';

var temperature;
var weatherDescription;
var image;
var forcast;
var wNow;
var wNext = [];
var wImg = [];
var weatherResponse;

var accessToken = ""
var refreshToken = ""
var clientId = ""
var clientSecret = ""
var authToken = "Basic " + btoa(clientId + ":" + clientSecret)

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
            image.className = "weatherIcon"
            image.src = response.properties.periods[0].icon
            document.body.appendChild(image)
            console.log(response)


            var forcast = document.createElement('embed');
            forcast.src = "https://embed.windy.com/embed2.html?lat=33.773&lon=-84.418&zoom=10&level=surface&overlay=radar&menu=false&message=false&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&detailLat=47.680&detailLon=-122.121&metricWind=default&metricTemp=default"
            if(response.properties.periods[0].shortForecast.indexOf("Rain") != -1 || response.properties.periods[0].shortForecast.indexOf("Shower") != -1 || response.properties.periods[0].shortForecast.indexOf("Thunderstorm") != -1){
                document.body.appendChild(forcast)
                weatherDescription.style.width = "700px";
                drawNowPlaying(true)
            } else {
                drawNowPlaying(false)
            }

            // if(true) {
            //     forcast.style="top: 300px"
            // }


            drawTemps(response)
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

function drawTemps(response) {
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
        wImg[i].className = "weatherIcon"
        wImg[i].src = response.properties.periods[i + 1].icon
        wImg[i].style.top = "810px"
        wImg[i].style.left = (320 + (300 * i)) + "px"
        document.body.appendChild(wImg[i])

    }
}

function drawNowPlaying(badweather) {
    var offset = 0;


    if(badweather) {
        offset = 450;
    }
    image = document.createElement('img');
    image.className = "trackImage"
    image.src = ""
    image.style.width = "150px"
    image.style.right = "150px"
    image.style.top = 150 + offset + "px"
    document.body.appendChild(image)

    var trackName = document.createElement('trackName');
    trackName.className = "trackName"
    trackName.innerHTML = ""
    trackName.style.top = 150 + offset + "px"
    document.body.appendChild(trackName)

    var trackArtist = document.createElement('trackArtist');
    trackArtist.className = "trackArtist"
    trackArtist.style.top = 200 + offset + "px"
    trackArtist.innerHTML = ""
    document.body.appendChild(trackArtist)

    var playlistName = document.createElement('playlistName');
    playlistName.className = "playlistName"
    playlistName.style.top = 250 + offset + "px"
    playlistName.style.right = "400px"
    playlistName.innerHTML = ""
    document.body.appendChild(playlistName)

    var playlistImage = document.createElement('img');
    playlistImage.className = "playlistImage"
    playlistImage.src = ""
    playlistImage.style.width = "50px"
    playlistImage.style.right = "325px"
    playlistImage.style.top = 250 + offset + "px"
    playlistImage.style.position = "fixed"
    document.body.appendChild(playlistImage)

}

function updateWeather() {
    fetchResults((error, response) => {
        if(weatherResponse != response.properties.periods[0].startTime) {
            location.reload();
        }
    })
}

function updateTrack() {
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
       method: 'GET',
       headers: {
         "Content-type": "application/json",
         "Accept": "application/json",
         "Authorization" : "Bearer " + accessToken
       }
     })
     .then(response => response.json())
     .then(function (data) {
         if(!data.error) {
             if(data.is_playing) {
                 if(data.item.name != document.getElementsByClassName("trackName")[0].innerHTML) {
                     updatePlaylist(data)
                 }
             } else {
                 document.getElementsByClassName("trackName")[0].innerHTML = ""
                 document.getElementsByClassName("trackArtist")[0].innerHTML = ""
                 document.getElementsByClassName("trackImage")[0].src = ""
                 document.getElementsByClassName("playlistName")[0].innerHTML = ""
                 document.getElementsByClassName("playlistImage")[0].src = ""
             }
         } else {
             getNewAccessToken()
         }
     })
     .catch(function (error) {
       console.log('Request failed', error);
     });
}

function updatePlaylist(data) {
    fetch(data.context.href, {
       method: 'GET',
       headers: {
         "Content-type": "application/json",
         "Accept": "application/json",
         "Authorization" : "Bearer " + accessToken
       }
     })
     .then(response => response.json())
     .then(function (playlistdata) {
         var trackName = data.item.name
         console.log(trackName)
         document.getElementsByClassName("trackName")[0].innerHTML = trackName
         var artistName = data.item.artists[0].name + " – " + data.item.album.name
         console.log(artistName)
         document.getElementsByClassName("trackArtist")[0].innerHTML = artistName
         var trackImage = data.item.album.images[0].url
         console.log(trackImage)
         document.getElementsByClassName("trackImage")[0].src = trackImage

         var playlistName = playlistdata.name
         console.log(playlistName)
         document.getElementsByClassName("playlistName")[0].innerHTML = playlistName
         var playlistImage = playlistdata.images[0].url
         console.log(playlistImage)
         document.getElementsByClassName("playlistImage")[0].src = playlistImage
     })
     .catch(function (error) {
       console.log('Request failed', error);
     });
}

updateTrack()
setInterval(updateTrack, 3000);

setupWeather();
setInterval(updateWeather, 20000);


function getNewAccessToken() {
    console.log(authToken)
    console.log(refreshToken)
    fetch("https://wq7r0g22m7.execute-api.us-east-1.amazonaws.com/default/apiProxy?url=accounts.spotify.com/api/token&auth=" + authToken, {
       method: 'POST',
       headers: {
         "Authorization" : authToken
       },
       body: "grant_type=refresh_token&refresh_token=" + refreshToken
     })
     .then(response => response.json())
     .then(function (data) {
         console.log(data)
         accessToken = data.access_token
         setTimeout(getNewAccessToken, data.expires_in * 1000)
     })
     .catch(function (error) {
       console.log('Request failed', error);
     });
}
