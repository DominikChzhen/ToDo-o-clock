let workTime = 25 * 60; // 25 minutes default
let breakTime = 5 * 60; // 5 minutes short break as default
let longBreakTime = 15 * 60; // 30 minutes long break
let isRunning = false;
let timeRemaining = workTime;
let timerInterval;

const timeDisplay = document.getElementById('time-display');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const increaseTimeButton = document.getElementById('increase-time');
const decreaseTimeButton = document.getElementById('decrease-time');
const shortBreakButton = document.getElementById('short-break-button');
const longBreakButton = document.getElementById('long-break-button');

function updateTimeDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimeDisplay();
            } else {
                alert("Zeit abgelaufen!");
                stopTimer();
            }
        }, 1000);
        isRunning = true;
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    timeRemaining = workTime;
    updateTimeDisplay();
}

function changeTime(amount) {
    if (timeRemaining + amount > 0) {
        timeRemaining += amount;
    }
    updateTimeDisplay();
}

function setBreakTime(lengthInMinutes) {
    stopTimer();
    timeRemaining = lengthInMinutes * 60;
    updateTimeDisplay();
}

function setPomodoroTime() {
    stopTimer();
    timeRemaining = workTime;
    updateTimeDisplay();
}

increaseTimeButton.addEventListener('click', () => changeTime(60)); // Add 1 minute
decreaseTimeButton.addEventListener('click', () => changeTime(-60)); // Subtract 1 minute
pomodoro.addEventListener('click', () => setPomodoroTime(25));
shortBreakButton.addEventListener('click', () => setBreakTime(5)); // Set short break
longBreakButton.addEventListener('click', () => setBreakTime(15)); // Set long break
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// Initial display update
updateTimeDisplay();