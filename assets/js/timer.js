const container = document.body;
const menuOptionsContainer = document.querySelector(".timer-menu__options");
const menuOptions = document.querySelectorAll("input[name=timerOptions]");
const menuTimesContainer = document.querySelector(".timer-menu__times");
const menuTimes = document.querySelectorAll(".timer-menu__times input");
const showClockCheckbox = document.getElementById("showClock");
const timerMenu = document.querySelectorAll(".timer-menu__options, .timer-menu__times, .timer-menu__settings");
const controlButton = document.getElementById("controlButton");
const resetButton = document.getElementById("resetButton");
const timerClock = document.querySelector(".timer-clock");

const iceBreakerTimes = ["4:00", "5:00", "6:00", "6:30"];
const regularSpeechTimes = ["5:00", "6:00", "7:00", "7:30"];
const longSpeechTimes = ["10:00", "11:00", "12:00", "12:30"];
const tableTopicsSpeechTimes = ["1:00", "1:30", "2:00", "2:30"];
const evaluationSpeechTimes = ["2:00", "2:30", "3:00", "3:30"];
const customSpeechTimes = ["mm:ss", "mm:ss", "mm:ss", "mm:ss"];

let currentTime = 0;
let prevClicked = false;
let intervalID = 0;

document.addEventListener("DOMContentLoaded", (event) => {
  //Update menuTimes based on selected menuOptions
  menuOptions.forEach((el) => {
    el.addEventListener("click", () => {
      if (el.checked === true) {
        switch (el.id) {
          case "iceBreaker": {
            let count = 0;
            menuTimes.forEach((el) => {
              //el.className = "valid";
              el.value = iceBreakerTimes[count];
              count++;
            });
            break;
          }

          case "regularSpeech": {
            let count = 0;
            menuTimes.forEach((el) => {
              //el.className = "valid";
              el.value = regularSpeechTimes[count];
              count++;
            });
            break;
          }

          case "longSpeech": {
            let count = 0;
            menuTimes.forEach((el) => {
              //el.className = "valid";
              el.value = longSpeechTimes[count];
              count++;
            });
            break;
          }

          case "tableTopics": {
            let count = 0;
            menuTimes.forEach((el) => {
              //el.className = "valid";
              el.value = tableTopicsSpeechTimes[count];
              count++;
            });
            break;
          }

          case "evaluationSpeech": {
            let count = 0;
            menuTimes.forEach((el) => {
              //el.className = "valid";
              el.value = evaluationSpeechTimes[count];
              count++;
            });
            break;
          }

          case "customSpeech": {
            let count = 0;
            menuTimes.forEach((el) => {
              //el.className = "invalid";
              el.value = customSpeechTimes[count];
              count++;
            });
            break;
          }

          default: {
            break;
          }
        }
      }
    });
  });

  //Validates menuTimes MM:SS format
  menuTimes.forEach((el) => {
    el.addEventListener("focus", () => {
      if (el.value.match(/^(([0]?[0-5][0-9]|[0-9]):([0-5][0-9]))$/)) {
        el.className = "valid";
      } else {
        el.className = "invalid";
      }
    });
  });

  controlButton.addEventListener("click", () => {
    if (!prevClicked) {
      startTimer();
    } else {
      stopTimer();
    }
  });

  resetButton.addEventListener("click", () => {
    resetTimer();
  });

  showClockCheckbox.addEventListener("click", () => {
    showClock();
  });
});

function startTimer() {
  let minTime = timeToMs(menuTimes[0].value);
  let midTime = timeToMs(menuTimes[1].value);
  let maxTime = timeToMs(menuTimes[2].value);
  let dqTime = timeToMs(menuTimes[3].value);

  if (intervalID !== 0) {
    clearInterval(intervalID);
  }

  intervalID = setInterval(() => {
    currentTime += 1e3;
    timerClock.innerHTML = msToTime(currentTime);
    if (currentTime == minTime) {
      container.style.backgroundColor = "green";
    } else if (currentTime == midTime) {
      container.style.backgroundColor = "yellow";
    } else if (currentTime == maxTime) {
      container.style.backgroundColor = "red";
    } else if (currentTime == dqTime) {
      container.style.backgroundColor = "white";
    }
  }, 1000);

  controlButton.innerHTML = "Stop";
  prevClicked = true;
  timerMenu.forEach((el) => {
    el.classList.add("hide");
  });
}

function stopTimer() {
  clearInterval(intervalID);
  controlButton.innerHTML = "Resume";
  prevClicked = false;
}

function resetTimer() {
  clearInterval(intervalID);
  currentTime = 0;
  timerClock.innerHTML = msToTime(currentTime);
  controlButton.innerHTML = "Start";
  container.style.removeProperty("background-color");
  prevClicked = false;
  timerMenu.forEach((el) => {
    if (el.classList.contains("hide")) {
      el.classList.remove("hide");
    }
  });
}

function showClock() {
  if (!showClockCheckbox.checked) {
    timerClock.style.visibility = "hidden";
  } else {
    timerClock.style.visibility = "unset";
  }
}

//converts MM:SS time format to milliseconds
function timeToMs(e) {
  var t = minuntes((e = e.split(":"))[0]).toPrecision(),
    o = seconds(e[1]).toPrecision();
  return Number(t) + Number(o);
}

//converts milliseconds to MM:SS time format
function msToTime(e) {
  var t = parseInt((e / 1e3) % 60),
    o = parseInt((e / 6e4) % 60),
    n = parseInt((e / 36e5) % 24);
  return (o = o < 10 ? "0" + o : o) + ":" + (t = t < 10 ? "0" + t : t);
}

//converts seconds to milliseconds
function seconds(e) {
  return 1e3 * e;
}
//converts minutes to milliseconds
function minuntes(e) {
  return 6e4 * e;
}
