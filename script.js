let focusTime = 0;  // Total accumulated focus time (in seconds)
let breakTime = 0;  // Total break time available (in seconds)
let timer;          // Stores the interval
let isFocusMode = true; // Tracks if we're in focus or break mode

const timerDisplay = document.getElementById("timer");
const modeTitle = document.getElementById("mode-title");
const breakBtn = document.getElementById("break-btn");

function startFocus() {
    isFocusMode = true;
    modeTitle.innerText = "Focus Mode";
    clearInterval(timer);
    
    timer = setInterval(() => {
        focusTime++;
        updateDisplay(focusTime);
    }, 1000);
}

function switchToBreak() {
    isFocusMode = false;
    modeTitle.innerText = "Break Mode";
    clearInterval(timer);

    // Add 1/3 of focus time to break time
    breakTime += Math.floor(focusTime / 3);
    focusTime = 0;  // Reset focus time since it's been used

    startBreak();
}

function startBreak() {
    if (breakTime <= 0) {
        return; // No break time available
    }

    timer = setInterval(() => {
        if (breakTime > 0) {
            breakTime--;
            updateDisplay(breakTime);
        } else {
            clearInterval(timer); // Stop when break time runs out
        }
    }, 1000);

    // Change button to "Focus" to allow switching back
    breakBtn.innerText = "Focus";
    breakBtn.onclick = startFocus;
}

function updateDisplay(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    timerDisplay.innerText = 
        (minutes < 10 ? "0" : "") + minutes + ":" + 
        (seconds < 10 ? "0" : "") + seconds;
}
