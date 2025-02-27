let focusTime = 0; // Stores total focus time in seconds
let breakTime = 0; // Stores accumulated break time in seconds
let isFocusMode = true; // Track if in Focus Mode
let timerInterval;
let startTime = 0; // Track when Focus Mode starts
let isRunning = false; // Track if timer is running

const modeTitle = document.getElementById("mode-title");
const timerDisplay = document.getElementById("timer");
const toggleBtn = document.getElementById("toggle-btn");
const breakBtn = document.getElementById("break-btn");

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function startFocusMode() {
    isFocusMode = true;
    modeTitle.textContent = "Focus Mode";
    toggleBtn.textContent = "Stop";
    breakBtn.textContent = "Break";
    breakBtn.disabled = false;
    startTime = Date.now();
    
    timerInterval = setInterval(() => {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopFocusMode() {
    clearInterval(timerInterval);
    let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    focusTime += elapsedTime;
    breakTime += Math.floor(elapsedTime / 3); // 1/3 Focus Time added to Break Time
    isRunning = false;
    toggleBtn.textContent = "Start";
}

function startBreakMode() {
    isFocusMode = false;
    modeTitle.textContent = "Break Mode";
    breakBtn.textContent = "Focus"; // Change to "Focus" button
    toggleBtn.disabled = true; // Disable Start/Stop button
    timerDisplay.textContent = formatTime(breakTime);

    timerInterval = setInterval(() => {
        if (breakTime > 0) {
            breakTime--;
            timerDisplay.textContent = formatTime(breakTime);
        } else {
            clearInterval(timerInterval);
            breakBtn.disabled = false;
        }
    }, 1000);
}

toggleBtn.addEventListener("click", () => {
    if (isRunning) {
        stopFocusMode();
    } else {
        startFocusMode();
        isRunning = true;
    }
});

breakBtn.addEventListener("click", () => {
    if (isFocusMode) {
        stopFocusMode();
        startBreakMode();
    } else {
        clearInterval(timerInterval); // Stop Break Timer
        startFocusMode(); // Switch back to Focus Mode
    }
});
