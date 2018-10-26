'use strict';

var timeHTML;
var dateHTML;

var welcomes = ["WELCOME BACK, REECE" , "HELLO REECE", "GOOD TO SEE YOU SIR", "HOWDY REECE"]
var longTime = ["HEY REECE WHAT'S NEW?", "LONG TIME NO SEE", "WHERE HAVE YOU BEEN HIDING?", "HOW'VE YOU BEEN?"]
var questions = ["HOW YA DOIN REECE?", "WHATS UP REECE?", "HEY REECE, HOWS IT GOIN?", "WHAT'S CRACKIN?", "WHAT'S GOOD?", "WHAT'S HAPPENIN?", "SUP HOMESLICE?"]
var otherLanguage = ["ALOHA REECE", "HOLA SEÑOR REECE", "BONJOUR REECE", "HALLO REECE", "CIAO REECE", "KONNICHIWA REECE"]
var affectionate = ["ELLO MATE", "HEEEY, BAAABY", "HOW YOU DOIN?", "I LIKE YOUR FACE", "HEY BOO"]
var morning = ["TOP OF THE MORNIN TO YA", "GOOOOOD MORNING, REECE!", "HAVE A NICE DAY", "ENJOY YOUR DAY", "GO GET EM TIGER"]


function getWelcome() {

    var d = new Date();
    var h = d.getHours();

    if(h <= 10 && h >= 5) {
        return morning[Math.round(Math.random() * 4)]
    } else if(h == 11) {
        return otherLanguage[Math.round(Math.random() * 5)]
    } else if(h >= 12 && h <= 15) {
        return questions[Math.round(Math.random() * 6)]
    } else if(h == 21) {
        return affectionate[Math.round(Math.random() * 4)]
    } else {
        return welcomes[Math.round(Math.random() * 3)]
    }
}

function getTimeText() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();

    h = (h > 12) ? h - 12 : h;
    //h = (h < 10) ? "0" + h : h;
    h = (h == 0) ? 12 : h;

    m = (m < 10) ? "0" + m : m;

    return h + ":" + m

}

function getDateText() {
    var d = new Date();

    var dateText = ordinal_suffix_of(d.getDate())

    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    var dayText = days[ d.getDay() ];
    var monthText = months[ d.getMonth() ];

    return dayText + ", " + monthText + " " + dateText;

}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function updateClock() {
    timeHTML.innerHTML = getTimeText();
}

function updateDay() {
    dateHTML.innerHTML = getDateText();
}

function setup() {
  //digits = document.querySelectorAll('digit');
  var welcomeText = document.createElement('welcome');
  welcomeText.innerHTML = getWelcome()
  document.body.appendChild(welcomeText)

  var timeText = document.createElement('time');
  timeText.innerHTML = getTimeText();
  document.body.appendChild(timeText)
  timeHTML = timeText;

  var dateText = document.createElement('date');
  dateText.innerHTML = getDateText()
  document.body.appendChild(dateText)
  dateHTML = dateText;
}

setup();
setInterval(updateClock, 10);
setInterval(updateDay, 1000);
