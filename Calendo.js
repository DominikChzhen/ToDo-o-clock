document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatRemainingTime(deadline) {
    const now = new Date();
    const dueDate = new Date(deadline);
    let diff = dueDate.getTime() - now.getTime();

    if (diff < 0) {
        return "Deadline überschritten";
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));

    let remainingTime = '';
    if (days > 0) remainingTime += `${days} Tage, `;
    if (hours > 0 || days > 0) remainingTime += `${hours} Stunden, `;
    remainingTime += `${minutes} Minuten`;

    return remainingTime;
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        // Name der Todo
        const taskNameDiv = document.createElement('div');
        taskNameDiv.className = 'todo-name';
        taskNameDiv.textContent = task.task;

        // Todo-Eigenschaften
        const taskDetailsDiv = document.createElement('div');
        taskDetailsDiv.className = 'todo-details';

        // Berechne verbleibende Zeit
        const remainingTime = formatRemainingTime(task.dueDate);
        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = 'due-date';
        dueDateSpan.textContent = remainingTime;

        const prioritySpan = document.createElement('span');
        prioritySpan.className = 'priority';
        prioritySpan.textContent = getEisenhowerPriorityLabel(task);

        const durationSpan = document.createElement('span');
        durationSpan.className = 'duration';
        durationSpan.textContent = `${task.duration} Minuten`;

        // Buttons für Bearbeiten und Löschen
        const editButton = document.createElement('button');
        editButton.textContent = 'Bearbeiten';
        editButton.onclick = () => editTask(index);
        editButton.className = 'editButton';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.onclick = () => deleteTask(index);
        deleteButton.classList.add('löschenButton');

        // Zusammenfügen der Todo Eigenschaften
        taskDetailsDiv.appendChild(dueDateSpan);
        taskDetailsDiv.appendChild(prioritySpan);
        taskDetailsDiv.appendChild(durationSpan);

        // Hinzufügen zur Todo-Liste
        li.appendChild(taskNameDiv);
        li.appendChild(taskDetailsDiv);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        // Li-Element zum Task-List Container hinzufügen
        taskList.appendChild(li);
    });
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    { task: "Einkaufen", dueDate: "2024-01-08", wichtig: true, dringend: false, duration: 60 },
    { task: "Rechnung bezahlen", dueDate: "2024-01-01", wichtig: true, dringend: true, duration: 10 },
    { task: "Meeting vorbereiten", dueDate: "2024-01-12", wichtig: true, dringend: false, duration: 120 }
];

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const deadline = document.getElementById('deadline').value;
    const taskPriorityW = document.getElementById('taskPriorityW').checked;
    const taskPriorityD = document.getElementById('taskDurationD').checked;
    const taskDuration = document.getElementById('taskDuration').value;

    if (taskName && deadline) {
        const newTask = {
            task: taskName,
            dueDate: function formatRemainingTime(deadline) {
    const now = new Date();
    const dueDate = new Date(deadline);
    let diff = dueDate.getTime() - now.getTime(); // berechnet die Differenz zwischen der Fälligkeit (dueDate) und der aktuellen Zeit (now)

    if (diff < 0) { //prüft, ob die diff negativ ist, was bedeutet, dass das Fälligkeitsdatum bereits in der Vergangenheit liegt
        return "Deadline überschritten";
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); //Berechnet die Anzahl der vollen Tage (days), indem die Differenz durch die Anzahl der Millisekunden an einem Tag (1000 * 60 * 60 * 24) dividiert wird, und zieht dann diese Tage von diff ab.
    diff -= days * (1000 * 60 * 60 * 24); 

    const hours = Math.floor(diff / (1000 * 60 * 60));//Berechnet die Anzahl der verbleibenden Stunden (hours) und zieht diese ebenfalls von der restlichen Differenz ab.
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60)); //prüft was in Minuten übrig bleibt

    let remainingTime = '';
    if (days > 0) remainingTime += `${days} Tage, `;
    if (hours > 0 || days > 0) remainingTime += `${hours} Stunden, `;
    remainingTime += `${minutes} Minuten`;

    return remainingTime; // wert für die verbleibende Zeit bis zur Deadline
}
,
            wichtig: taskPriorityW,  
            dringend: taskPriorityD,
            duration: parseInt(taskDuration) || 0,
            added: Date.now()
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
    } else {
        alert('Die Aufgabe konnte nicht hinzugefügt werden. Bitte achte darauf sowohl eine Bezeichnung für die Aufgabe als auch das Fälligkeitsdatum mit Uhrzeit, die Priorität und die geschätzte Bearbeitungsdauer der Aufgabe an.');
    }
}

function getEisenhowerPriority(task) {  /* Sortieren nach wichtig & dringend */
    if (task.dringend && task.wichtig) return 1; // zuerst erledigen
    if (task.dringend && !task.wichtig) return 2; // delegieren
    if (!task.dringend && task.wichtig) return 3; // terminieren
    if (!task.dringend && !task.wichtig) return 4; // verwerfen
    return 5;  
}

function getEisenhowerPriorityLabel(task) {  /* richtig anzeigen */
    if (task.dringend && task.wichtig) return " 1, zuerst erledigen";
    if (task.dringend && !task.wichtig) return "3, delegieren";
    if (!task.dringend && task.wichtig) return "2, terminieren";
    if (!task.dringend && !task.wichtig) return "verwerfen";
    return "Unbekannt";
}


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
    } else if (criteria === 'eisenhower') {  
        tasks.sort((a, b) => getEisenhowerPriority(a) - getEisenhowerPriority(b)); 
    }
    loadTasks();
}

function editTask(index) {
    const task = tasks[index];
    
    const newTaskName = prompt('Bezeichnung der To Do bearbeiten:', task.task);
    const newDueDate = prompt('Fälligkeitsdatum bearbeiten:', task.dueDate);
    const newPriorityW = prompt('Ist die Aufgabe wichtig? (ja/nein)', task.wichtig ? 'ja' : 'nein'); 
    const newPriorityD = prompt('Ist die Aufgabe dringend? (ja/nein)', task.dringend ? 'ja' : 'nein');
    const newDuration = prompt('geschätzten Zeitaufwand (in Minuten) bearbeiten:', task.duration);

    if (newTaskName && newDueDate) {
        tasks[index].task = newTaskName;
        tasks[index].dueDate = newDueDate;
        tasks[index].wichtig = stringToBoolean(newPriorityW);  // Correct conversion
        tasks[index].dringend = stringToBoolean(newPriorityD); // Correct conversion  
        tasks[index].duration = parseInt(newDuration) || task.duration;
        
        console.log('Updated Task:', tasks[index]); // Debug line to check updates
        saveTasks(); // Attempt to save updated tasks
        loadTasks(); // Attempt to reload the updated tasks
    } else {
        alert('Bearbeitung abgebrochen oder unvollständig. Änderungen wurden nicht gespeichert.');
    }
}
function stringToBoolean(response) {
    return response.trim().toLowerCase() === 'ja';
}
let debounceTimeout;
function debounceSave() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(saveTasks, 300);  // Speicherung nach 300ms Inaktivität
}

function deleteTask(index) {
    if (confirm("Bist du sicher, dass du dieses To-Do löschen möchtest?")) {
        tasks.splice(index, 1);
        console.log('Nach dem Löschen:', tasks); 
        saveTasks();
        loadTasks();
    }
    function saveTasks() {
        // Convert task list to JSON string and save to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        
        tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Ensure tasks are re-loaded
    
        tasks.forEach((task, index) => {
            // Existing code to create elements and display each task...
        });
    }
}

function openAddTaskPopup() {
    document.getElementById('addTaskPopup').style.display = 'block';
}

function closeAddTaskPopup() {
    document.getElementById('addTaskPopup').style.display = 'none';
}

function addTaskFromPopup() {
    const taskName = document.getElementById('popupTaskName').value;
    const deadline = document.getElementById('popupDeadline').value;
    const taskPriorityW = document.getElementById('popupTaskPriorityW').checked;
    const taskPriorityD = document.getElementById('popupTaskPriorityD').checked;
    const taskDuration = document.getElementById('popupTaskDuration').value;

    if (taskName && deadline) {
        const newTask = {
            task: taskName,
            dueDate: deadline,
            wichtig: taskPriorityW,
            dringend: taskPriorityD,
            duration: parseInt(taskDuration) || 0,
            added: Date.now()
        };
        tasks.push(newTask);
        saveTasks();
        loadTasks();
        
        // Felder nach dem Hinzufügen zurücksetzen
        document.getElementById('popupTaskName').value = '';
        document.getElementById('popupDeadline').value = '';
        document.getElementById('popupTaskPriorityW').checked = false; 
        document.getElementById('popupTaskPriorityD').checked = false; 
        document.getElementById('popupTaskDuration').value = '';
        
        closeAddTaskPopup();
    } else {
        alert('Die Aufgabe konnte nicht hinzugefügt werden. Bitte achte darauf sowohl eine Bezeichnung für die Aufgabe als auch das Fälligkeitsdatum mit Uhrzeit, die Priorität und die geschätzte Bearbeitungsdauer der Aufgabe an.');
    }
}
