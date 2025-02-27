document.addEventListener("DOMContentLoaded", function () {
    let focusTime = 0;
    let breakTime = 0;
    let focusInterval, breakInterval;
    let isFocusMode = true;
    let isRunning = false;

    const timerDisplay = document.getElementById("timer");
    const toggleBtn = document.getElementById("toggle-btn");
    const modeBtn = document.getElementById("break-btn");

    function updateDisplay(time) {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function startFocus() {
        focusInterval = setInterval(() => {
            focusTime++;
            updateDisplay(focusTime);
        }, 1000);
    }

    function startBreak() {
        breakInterval = setInterval(() => {
            if (breakTime > 0) {
                breakTime--;
                updateDisplay(breakTime);
            } else {
                clearInterval(breakInterval);
                isRunning = false;
                toggleBtn.textContent = "Start";
            }
        }, 1000);
    }

    toggleBtn.addEventListener("click", function () {
        if (isRunning) {
            clearInterval(focusInterval);
            clearInterval(breakInterval);
            isRunning = false;
            toggleBtn.textContent = "Start";
        } else {
            isRunning = true;
            toggleBtn.textContent = "Stop";
            if (isFocusMode) {
                startFocus();
            } else {
                startBreak();
            }
        }
    });

    modeBtn.addEventListener("click", function () {
        if (isFocusMode) {
            clearInterval(focusInterval);
            breakTime += Math.floor(focusTime / 3);
            focusTime = 0;
            isFocusMode = false;
            updateDisplay(breakTime);
            modeBtn.textContent = "Focus";
        } else {
            clearInterval(breakInterval);
            isFocusMode = true;
            updateDisplay(focusTime);
            modeBtn.textContent = "Break";
        }
        isRunning = false;
        toggleBtn.textContent = "Start";
    });

    updateDisplay(focusTime);
});
