let focusTime = 0;  // Total accumulated focus time (in seconds)
let breakTime = 0;  // Total break time available (in seconds)
let timer;          // Stores the interval
let isFocusMode = true; // Tracks if we're in focus or break mode
let isRunning = false; // Tracks if the timer is running

const timerDisplay = document.getElementById("timer");
const modeTitle = document.getElementById("mode-title");
const toggleBtn = document.getElementById("toggle-btn");
const breakBtn = document.getElementById("break-btn");

// Toggle function for Start/Stop
function toggleFocus() {
    if (isRunning) {
        stopTimer();
    } else {
        startFocus();
    }
}

// Starts Focus Mode (Stopwatch)
function startFocus() {
    isFocusMode = true;
    isRunning = true;
    modeTitle.innerText = "Focus Mode";
    toggleBtn.innerText = "Stop";
    clearInterval(timer);

    timer = setInterval(() => {
        focusTime++;
        updateDisplay(focusTime);
    }, 1000);
}

// Stops the timer (pauses Focus or Break)
function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    toggleBtn.innerText = "Start";
}

// Switch to Break Mode (Timer)
function switchToBreak() {
    if (isFocusMode) {
        // Add 1/3 of focus time to break time
        breakTime += Math.floor(focusTime / 3);
        focusTime = 0;  // Reset focus time since it's been used
    }

    isFocusMode = false;
    modeTitle.innerText = "Break Mode";
    clearInterval(timer);
    isRunning = false;
    toggleBtn.innerText = "Start";

    startBreak();
}

// Starts Break Mode (Countdown Timer)
function startBreak() {
    if (breakTime <= 0) {
        return; // No break time available
    }

    isRunning = true;
    toggleBtn.innerText = "Stop";

    timer = setInterval(() => {
        if (breakTime > 0) {
            breakTime--;
            updateDisplay(breakTime);
        } else {
            clearInterval(timer);
            isRunning = false;
            toggleBtn.innerText = "Start";
        }
    }, 1000);
}

// Update timer display in MM:SS format
function updateDisplay(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    timerDisplay.innerText =
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds;
}

// Assign button click events
toggleBtn.addEventListener("click", toggleFocus);
breakBtn.addEventListener("click", switchToBreak);
