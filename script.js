// MODE: true = Focus, false = Break
let isFocusMode = true;

// TIME TRACKING
let totalFocusTime = 0;      // Total focus time accumulated (seconds)
let leftoverBreakTime = 0;   // Accumulated break time left (seconds)

// SESSION TRACKING
let sessionStart = 0;        // Timestamp (ms) when the current session started
let sessionElapsed = 0;      // How many seconds have elapsed in this session

// STATE
let isRunning = false;       // Is the timer running?
let timerInterval = null;

// DOM ELEMENTS
const modeTitle     = document.getElementById("modeTitle");
const timerDisplay  = document.getElementById("timerDisplay");
const startBtn      = document.getElementById("startBtn");
const stopBtn       = document.getElementById("stopBtn");
const toggleBtn     = document.getElementById("toggleBtn");

// ---------------------
// EVENT LISTENERS
// ---------------------
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
toggleBtn.addEventListener("click", toggleMode);

// ---------------------
// HELPER FUNCTIONS
// ---------------------
function formatTime(seconds) {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateDisplay(seconds) {
  timerDisplay.textContent = formatTime(seconds);
}

// ---------------------
// CORE LOGIC
// ---------------------

function startTimer() {
  if (isRunning) return; // If already running, do nothing
  isRunning = true;
  sessionStart = Date.now(); // Mark the start time of this session

  timerInterval = setInterval(() => {
    let now = Date.now();
    sessionElapsed = Math.floor((now - sessionStart) / 1000);

    if (isFocusMode) {
      // Focus Mode: STOPWATCH counting UP from totalFocusTime
      updateDisplay(totalFocusTime + sessionElapsed);
    } else {
      // Break Mode: TIMER counting DOWN from leftoverBreakTime
      let timeLeft = leftoverBreakTime - sessionElapsed;
      if (timeLeft <= 0) {
        // Break finished
        clearInterval(timerInterval);
        isRunning = false;
        leftoverBreakTime = 0;
        updateDisplay(0);
      } else {
        updateDisplay(timeLeft);
      }
    }
  }, 1000);
}

function stopTimer() {
  if (!isRunning) return; // If already stopped, do nothing
  clearInterval(timerInterval);
  isRunning = false;

  // Calculate final elapsed time in this session
  let finalElapsed = Math.floor((Date.now() - sessionStart) / 1000);

  if (isFocusMode) {
    // Add to total focus time
    totalFocusTime += finalElapsed;
    updateDisplay(totalFocusTime);
  } else {
    // Subtract from leftover break time
    leftoverBreakTime -= finalElapsed;
    if (leftoverBreakTime < 0) leftoverBreakTime = 0;
    updateDisplay(leftoverBreakTime);
  }

  sessionElapsed = 0;
}

function toggleMode() {
  // 1. First, stop the current mode
  stopTimer();

  // 2. Switch the mode
  if (isFocusMode) {
    // Going from Focus -> Break
    // Earn new break time = 1/3 of this *session's* focus
    // But how do we know how much was "this session's" focus?
    // We stored it in finalElapsed inside stopTimer. However,
    // that was already added to totalFocusTime. So let's do:
    // newFocusThisSession = finalElapsed, but we don't have finalElapsed
    // after we call stopTimer(). Instead, we can compute the difference
    // between totalFocusTime now and what it was before. Let's handle that
    // by storing "previousFocusTime" before stopTimer if we want more detail.

    // Simpler approach:
    // If we want 1/3 of "newly added focus", we do:
    // newFocusThisSession = totalFocusTime - oldTotalFocusTime
    // We'll keep a separate variable or approach.

    // But in this approach, let's assume the user means "1/3 of totalFocusTime".
    // If you only want 1/3 of the newly added focus, we must track that differently.
    // For now, let's do 1/3 of *just now* plus leftover logic.

    // We'll do a quick fix: We'll store oldFocusTime before we call stopTimer,
    // then after stopTimer, we see how much was gained.

    // We'll handle it by adjusting code slightly. See "Improved Approach" below.

    // For now, let's set the UI changes:

    modeTitle.textContent = "Break Mode";
    toggleBtn.textContent = "Focus";
    toggleBtn.style.background = "#007bff"; // Blue for "Focus"
    isFocusMode = false;

    // We start the break immediately
    // "startTimer()" -> countdown from leftoverBreakTime
    startTimer();

  } else {
    // Going from Break -> Focus
    modeTitle.textContent = "Focus Mode";
    toggleBtn.textContent = "Break";
    toggleBtn.style.background = "#ffc107"; // Yellow for "Break"
    isFocusMode = true;

    // Start the stopwatch
    startTimer();
  }
}

// ---------------------
// IMPROVED: Track "newly added" focus for each toggle
// ---------------------

// We'll store oldFocusTime before we switch from Focus -> Break
// so we can add 1/3 of the difference to leftoverBreakTime.
let oldFocusTime = 0;

// We override toggleMode slightly to handle the newFocusThisSession logic:
const realToggleMode = toggleMode; // store old function
toggleMode = function() {
  if (isFocusMode) {
    // We are about to stop Focus -> Break
    // store the old focus time
    oldFocusTime = totalFocusTime;
  }
  // call the original toggle
  realToggleMode();

  if (!isFocusMode) {
    // Just switched to Break Mode
    // The newly added focus is totalFocusTime - oldFocusTime
    let newFocusThisSession = totalFocusTime - oldFocusTime;
    let newBreak = Math.floor(newFocusThisSession / 3);
    leftoverBreakTime += newBreak;
  }
};