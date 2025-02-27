let isFocusMode = true;
let isRunning = false;
let focusTime = 0; 
let breakTime = 0;
let timer;
let startTime;
let elapsedTime = 0;

const timeDisplay = document.getElementById("time-display");
const modeTitle = document.getElementById("mode-title");
const toggleBtn = document.getElementById("toggle-btn");
const modeBtn = document.getElementById("mode-btn");

function updateTime() {
    let totalSeconds = Math.floor(elapsedTime / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    timeDisplay.textContent = 
        String(hours).padStart(2, "0") + ":" + 
        String(minutes).padStart(2, "0") + ":" + 
        String(seconds).padStart(2, "0");
}

function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateTime();
        }, 1000);
        isRunning = true;
        toggleBtn.textContent = "Stop";
    }
}

function stopTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        toggleBtn.textContent = "Start";
    }
}

function switchMode() {
    if (isFocusMode) {
        // Switching to Break Mode
        clearInterval(timer);
        focusTime += elapsedTime; // Add to total focus time
        breakTime += Math.floor(focusTime / 3); // Add 1/3rd of focus time to break time
        elapsedTime = breakTime * 1000; // Set break time
        isFocusMode = false;
        modeTitle.textContent = "Break Mode";
        modeBtn.textContent = "Focus";
        startTimer(); // Auto-start break timer
    } else {
        // Switching to Focus Mode
        clearInterval(timer);
        elapsedTime = focusTime; // Continue from last focus time
        isFocusMode = true;
        modeTitle.textContent = "Focus Mode";
        modeBtn.textContent = "Break";
        startTimer(); // Auto-start focus stopwatch
    }
}

// Event Listeners
toggleBtn.addEventListener("click", () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

modeBtn.addEventListener("click", switchMode);
