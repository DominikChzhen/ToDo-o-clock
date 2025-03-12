// Initiale Zeit In Sekunden
const workTime = 25 * 60; // Standard 25 Minuten für Arbeit
const shortBreakTime = 5 * 60; // 5 Minuten kurze Pause
const longBreakTime = 30 * 60; // 30 Minuten lange Pause
let timeRemaining = workTime; // Aktueller Timer-Stand
let currentBaseTime = workTime; // Basiswert des aktuellen Timers
let timerInterval;
let isRunning = false;
let elapsedTime = 0;  // Verstrichene Zeit um "Stunden heute" zu berechnen
let workedTime = 0;
let isWorkTime = true;
// Elemente selektieren
const timeDisplay = document.getElementById('time-display');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const hoursTodayElement = document.getElementById('hoursToday'); // Das Element für "Stunden heute"
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('short-break-button');
const longBreakButton = document.getElementById('long-break-button');
const increaseButton = document.getElementById('increase-time');
const decreaseButton = document.getElementById('decrease-time');

// Initialisieren oder aus dem Speicher laden
let totalTodayTime = parseFloat(localStorage.getItem('totalTodayTime')) || 0;

// Funktion um Uhr zu aktualisieren
function updateTimeDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('time-display').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Startet den Timer
function startTimer() {
    if (!isRunning) {
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                if(isWorkTime){
                    workedTime++;
                }
                elapsedTime++;
                updateTimeDisplay();
                sendUpdateToMainWindow();
            } else {
                alert("Zeit abgelaufen!");
                stopTimer();
            }
        }, 1000);
        isRunning = true;
    }
}

// Stoppt den Timer
async function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    if (isWorkTime) {
        console.log("Before fetch:", workedTime);  // Log workedTime before the fetch

        /*try {
            const url = `/timeWorked/${workedTime}`;  // Construct the URL
            console.log('Fetch URL:', url);  // Log the constructed URL

            const response = await fetch(url);

            // Check if the response is ok (status 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response and log it
            const responseData = await response.json();  // Assuming the response is JSON
            console.log('Fetch completed with response data:', responseData);

            // Reset workedTime after fetch completes
            workedTime = 0;
            console.log("After reset:", workedTime);
        } catch (error) {
            // Log errors if fetch fails
            console.error('Error during fetch:', error);
        }*/
    
        try{
            await fetch(`/timeWorked/${workedTime}`)
            workedTime = 0;
            console.log(workedTime);
            window.opener.location.href = '/todos';
        } catch (error){
            console.error('Error:', error);
        }
    }
}

function sendUpdateToMainWindow() {
    // Umrechnen der `elapsedTime` in Stunden
    const hoursToday = elapsedTime / 3600;
    window.opener.postMessage({ hoursToday }, window.opener.location.href); // Sende Daten ans Hauptfenster
}


// Setzt den Timer zurück
function resetTimer() {
    stopTimer();
    timeRemaining = currentBaseTime;
    updateTimeDisplay();
}

// Setzt die Timer-Zeit auf die Standard-Arbeitszeit
pomodoroButton.addEventListener('click', () => {
    stopTimer();        // Stoppt den Timer, falls dieser läuft
    currentBaseTime = workTime;
    timeRemaining = workTime;
    isWorkTime = true;
    updateTimeDisplay();
});

// Setzt die Timer-Zeit auf die kurze Pausenzeit
shortBreakButton.addEventListener('click', () => {
    stopTimer();        // Falls der Timer läuft, stoppen
    currentBaseTime = shortBreakTime;
    timeRemaining = shortBreakTime;
    isWorkTime = false;
    updateTimeDisplay();
});

// Setzt die Timer-Zeit auf die lange Pausenzeit
longBreakButton.addEventListener('click', () => {
    stopTimer();        // Falls der Timer läuft, stoppen
    currentBaseTime = longBreakTime;
    timeRemaining = longBreakTime;
    isWorkTime = false;
    updateTimeDisplay();
});

// Fügt 60 Sekunden zum Timer hinzu
increaseButton.addEventListener('click', () => {
    timeRemaining += 60;
    currentBaseTime = timeRemaining; // Basiswert aktualisieren
    updateTimeDisplay();
})

// Zieht 60 Sekunden vom Timer ab
decreaseButton.addEventListener('click', () => {
    if(timeRemaining >= 60){
        timeRemaining -= 60;
        currentBaseTime = timeRemaining; // Basiswert aktualisieren
        updateTimeDisplay();
    }

})

// Funktion um "Stunden heute" zu aktualisieren
function updateHoursToday() {
    totalTodayTime += 1 / 3600; // Füge 1 Sekunde in Stunden umgewandelt hinzu
    hoursTodayElement.textContent = totalTodayTime.toFixed(2); // Zeige in Stunden
    localStorage.setItem('totalTodayTime', totalTodayTime); // Speichern für persistente Speicherung
}

// Event-Listener
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// Binde Events
document.getElementById('start-button').addEventListener('click', startTimer);
document.getElementById('stop-button').addEventListener('click', stopTimer);

// Initiales Update
updateTimeDisplay();