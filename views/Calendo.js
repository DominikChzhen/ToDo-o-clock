// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', function () {
    loadTasks(); // Lädt die Aufgaben aus dem lokalen Speicher und zeigt sie an
    displayCompletedTasks(); // Stellt sicher, dass die erledigten Aufgaben beim Start geladen werden
});

// Aufgaben-Array aus dem lokalen Speicher laden
const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Lädt die Aufgaben aus dem lokalen Speicher oder initialisiert ein leeres Array

// Datum und Uhrzet aktualisieren
function updateDateTime() {
    const dateTimeElement = document.getElementById('currentDateTime');
    const now = new Date();
    
    const dayOptions = { weekday: 'long' }; 
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    // Deutsches Format mit langen Datumsformaten und freundlichem Tagesnamen
    const day = now.toLocaleDateString('de-DE', dayOptions);
    const date = now.toLocaleDateString('de-DE', dateOptions);
    const time = now.toLocaleTimeString('de-DE', timeOptions);
  
    dateTimeElement.textContent = `${day} ${date} | ${time}`;
}

// Initiales Setzen von Datum und Uhrzeit
updateDateTime();

// Aktualisiert Datum und Uhrzeit jede Sekunde
setInterval(updateDateTime, 1000);

//Modal-Funktionen
function openModal() {
    document.getElementById('todoModal').style.display = 'block'; // Öffnet das Modal
}

function closeModal() {
    document.getElementById('todoModal').style.display = 'none'; // Schließt das Modal
}
//Aufgabe aus dem Modal speichern
function saveModalTask() {
    const taskName = document.getElementById('modalTaskName').value;
    const deadline = document.getElementById('modalDeadline').value;
    const taskPriorityW = document.getElementById('modalTaskPriorityW').checked;
    const taskPriorityD = document.getElementById('modalTaskPriorityD').checked;
    const taskIcon = document.getElementById('modalIconSelect').value;

    if (taskName) {
        const newTask = {
            name: taskName,
            dueDate: deadline,
            wichtig: taskPriorityW,
            dringend: taskPriorityD,
            added: Date.now(),
            icon: taskIcon
        };
        tasks.push(newTask);
        saveTasks();
        loadTasks();
        closeModal(); // Schließt das Modal nach dem Hinzufügen der Aufgabe

        // Felder zurücksetzen
        document.getElementById('modalTaskName').value = '';
        document.getElementById('modalDeadline').value = '';
        document.getElementById('modalTaskPriorityW').checked = false;
        document.getElementById('modalTaskPriorityD').checked = false;
    } else {
        alert('Bitte füllen Sie das Aufgabenname-Feld aus.');
    }
}

//Aufgabe hinzufügen
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const deadline = document.getElementById('deadline').value;
    const taskPriorityW = document.getElementById('taskPriorityW').checked;
    const taskPriorityD = document.getElementById('taskPriorityD').checked;
    const taskDuration = document.getElementById('taskDuration').value;
    const taskIcon = document.getElementById('icon-select').value;

    if (taskName && deadline && taskDuration) {
        const newTask = {
            name: taskName,
            dueDate: deadline,
            wichtig: taskPriorityW,
            dringend: taskPriorityD,
            duration: parseInt(taskDuration) || 0,
            added: Date.now(),
            icon: taskIcon
        };
        tasks.push(newTask);
        saveTasks();
        loadTasks();

        // Felder nach dem Hinzufügen zurücksetzen
        document.getElementById('taskName').value = '';
        document.getElementById('deadline').value = '';
        document.getElementById('taskPriorityW').checked = false;
        document.getElementById('taskPriorityD').checked = false;
        document.getElementById('taskDuration').value = '';
        document.getElementById('icon-select').value = '🛒'; // Zurücksetzen auf Standard
    } else {
        alert('Die Aufgabe konnte nicht hinzugefügt werden. Bitte achte darauf sowohl eine Bezeichnung für die Aufgabe als auch das Fälligkeitsdatum mit Uhrzeit, die Priorität und die geschätzte Bearbeitungsdauer der Aufgabe anzugeben.');
    }
}
//Todo hinzufügen
function addTodo() {
    const iconSelect = document.getElementById('icon-select');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    const icon = iconSelect.value;
    const todoText = todoInput.value;

    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';

    const iconElement = document.createElement('span');
    iconElement.className = 'icon';
    iconElement.textContent = icon;

    const textElement = document.createElement('span');
    textElement.textContent = todoText;

    todoItem.appendChild(iconElement);
    todoItem.appendChild(textElement);
    todoList.appendChild(todoItem);

    todoInput.value = '';
}

//Aufgaben speichern
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Speichert die Aufgaben im lokalen Speicher
}

//Verbleibende Zeit formatieren
function formatRemainingTime(deadline) {
    const now = new Date();
    const dueDate = new Date(deadline);
    const timeDiff = dueDate - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
}

//Aufgaben laden
function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const iconElement = document.createElement('span');
        iconElement.className = 'task-icon';
        iconElement.textContent = task.icon;

        const textElement = document.createElement('span');
        textElement.className = 'task-name';
        textElement.textContent = task.name;

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progress = document.createElement('div');
        progress.className = 'progress';
        progress.style.width = "100%"; 
        progressBar.appendChild(progress);

        // Erledigt Button
        const completeButton = document.createElement('button');
        completeButton.className = 'completeButton';
        completeButton.textContent = 'Erledigt';
        completeButton.onclick = () => completeTask(index);

        // Löschen Button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'deleteButton';
        deleteButton.textContent = 'Löschen';
        deleteButton.onclick = () => deleteTask(index);

        // Bearbeiten Button
        const editButton = document.createElement('button');
        editButton.className = 'editButton';
        editButton.textContent = 'Bearbeiten';
        editButton.onclick = () => editTask(index);

        taskItem.appendChild(iconElement);
        taskItem.appendChild(textElement);
        taskItem.appendChild(progressBar);
        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        taskItem.appendChild(editButton);
        taskList.appendChild(taskItem);
    });
}

//Eisenhower-Matrix bestimmen
function getEisenhowerPriority(task) {  /* Sortieren nach wichtig & dringend */
    if (task.dringend && task.wichtig) return 1; // first to be done
    if (task.dringend && !task.wichtig) return 2; // delegate
    if (!task.dringend && task.wichtig) return 3; // schedule
    if (!task.dringend && !task.wichtig) return 4; // discard
    return 5;
}

function getEisenhowerPriorityLabel(task) {
    if (task.wichtig && task.dringend) {
        return 'Wichtig und Dringend';
    } else if (task.wichtig) {
        return 'Wichtig';
    } else if (task.dringend) {
        return 'Dringend';
    } else {
        return 'Normal';
    }
}

//Aufgabe sortieren
function sortTasks(criteria) {
    if (criteria === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (criteria === 'priority' || criteria === 'eisenhower') {
        tasks.sort((a, b) => getEisenhowerPriority(a) - getEisenhowerPriority(b));
    } else if (criteria === 'added') {
        tasks.sort((a, b) => b.added - a.added);
    } else if (criteria === 'duration_niedrig-hoch') {
        tasks.sort((a, b) => a.duration - b.duration);
    } else if (criteria === 'duration_hoch-niedrig') {
        tasks.sort((a, b) => b.duration - a.duration);
    }
    loadTasks();
}

//Aufgabe bearbeiten
function editTask(index) {
    // Get task details for editing
    const task = tasks[index];
    const newTaskName = prompt('Bezeichnung der To-Do bearbeiten:', task.name);
    const newDueDate = prompt('Fälligkeitsdatum bearbeiten:', task.dueDate);
    const newPriorityW = prompt('Ist die Aufgabe wichtig? (ja/nein)', task.wichtig ? 'ja' : 'nein'); 
    const newPriorityD = prompt('Ist die Aufgabe dringend? (ja/nein)', task.dringend ? 'ja' : 'nein');

    if (newTaskName && newDueDate) {
        task.name = newTaskName;
        task.dueDate = newDueDate;
        task.wichtig = stringToBoolean(newPriorityW); // Correct conversion
        task.dringend = stringToBoolean(newPriorityD); // Correct conversion
        task.duration = parseInt(newDuration) || task.duration;

        console.log('Updated Task:', task); // Debug line to check updates
        saveTasks(); // Attempt to save updated tasks
        loadTasks(); // Attempt to reload the updated tasks
    } else {
        alert('Bearbeitung abgebrochen oder unvollständig. Änderungen wurden nicht gespeichert.');
    }
}

function stringToBoolean(response) {
    return response.trim().toLowerCase() === 'ja';
}

//Aufgabe speichern
let debounceTimeout;
function debounceSave() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(saveTasks, 300); // Save after 300ms of inactivity
}

//Aufgabe löschen
function deleteTask(index) {
    if (confirm("Bist du sicher, dass du dieses To-Do löschen möchtest?")) {
        tasks.splice(index, 1); // Entfernt die Aufgabe aus dem Array
        saveTasks();            // Speichert die aktualisierte Aufgabenliste im lokalen Speicher
        loadTasks();            // Lädt die Aufgabenliste neu
    }
}

//Aufgabe als erledigt markieren
function completeTask(index) {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.push(tasks[index]);
    tasks.splice(index, 1);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    saveTasks();
    loadTasks();
    displayCompletedTasks();
}

//Erledigte Aufgaben anzeigen
function displayCompletedTasks() {
    const completedTaskList = document.getElementById('completedTaskList');
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTaskList.innerHTML = '';

    completedTasks.forEach((task, index) => {
        const completedTaskItem = document.createElement('li');
        completedTaskItem.textContent = `${task.icon} ${task.name}`;

        // Rückgängig machen Button
        const undoButton = document.createElement('button');
        undoButton.textContent = 'Rückgängig';
        undoButton.onclick = () => undoTask(index);

        completedTaskItem.appendChild(undoButton);
        completedTaskList.appendChild(completedTaskItem);
    });
}

//Erledigte Aufgabe rückgängig machen
function undoTask(index) {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    if (index >= 0 && index < completedTasks.length) {
        const taskToUndo = completedTasks.splice(index, 1)[0]; // Entfernt aus den erledigten Aufgaben
        tasks.push(taskToUndo);  // Fügt es zurück zur Hauptaufgabenliste hinzu
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

        // Update the completed task count
        completedTaskCount--;
        completedCountElement.textContent = completedTaskCount;
        localStorage.setItem('completedTaskCount', JSON.stringify(completedTaskCount));

        saveTasks();
        loadTasks();
        displayCompletedTasks();
    } else {
        alert('Ungültiger Index für das Rückgängigmachen.');
    }
}

//Dropdown schließen, wenn außerhalb geklickt wird
window.onclick = function(event) {
    if (!event.target.matches('.sort-dropbtn')) {
        var dropdowns = document.getElementsByClassName("sort-dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}

//Zähler für erledigte Aufgaben
let completedTaskCount = localStorage.getItem('completedTaskCount') ? JSON.parse(localStorage.getItem('completedTaskCount')) : 0;
const completedCountElement = document.getElementById('tasksCompleted');

// Funktion zum Hochzählen, wenn eine Aufgabe als erledigt markiert wird
function completeTask(index) {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.push(tasks[index]);
    tasks.splice(index, 1);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

    // Update the completed task count
    completedTaskCount++;
    completedCountElement.textContent = completedTaskCount;
    localStorage.setItem('completedTaskCount', JSON.stringify(completedTaskCount));

    saveTasks();
    loadTasks();
    displayCompletedTasks();
}

// Initialisiere die Anzeige mit dem gespeicherten Wert
completedCountElement.textContent = completedTaskCount;
