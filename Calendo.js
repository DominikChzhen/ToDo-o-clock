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
        taskNameDiv.onclick = () => openEditTaskPopup(index); // Öffne Pop-up beim Klicken

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

        // Zusammenfügen der Todo Eigenschaften
        taskDetailsDiv.appendChild(dueDateSpan);
        taskDetailsDiv.appendChild(prioritySpan);
        taskDetailsDiv.appendChild(durationSpan);

        // Hinzufügen zur Todo-Liste
        li.appendChild(taskNameDiv);
        li.appendChild(taskDetailsDiv);

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
    const taskPriorityD = document.getElementById('taskPriorityD').checked;
    const taskDuration = document.getElementById('taskDuration').value;

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
        document.getElementById('taskName').value = '';
        document.getElementById('deadline').value = '';
        document.getElementById('taskPriorityW').checked = false; 
        document.getElementById('taskPriorityD').checked = false; 
        document.getElementById('taskDuration').value = '';

        // Pop-Up-Formular schließen
        closeAddTaskPopup();
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
    if (task.dringend && task.wichtig) return "1, zuerst erledigen";
    if (task.dringend && !task.wichtig) return "3, delegieren";
    if (!task.dringend && task.wichtig) return "2, terminieren";
    if (!task.dringend && !task.wichtig) return "4, verwerfen";
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

function openEditTaskPopup(index) {
    const task = tasks[index];
    document.getElementById('editTaskName').value = task.task;
    document.getElementById('editDeadline').value = task.dueDate;
    document.getElementById('editTaskPriorityW').checked = task.wichtig;
    document.getElementById('editTaskPriorityD').checked = task.dringend;
    document.getElementById('editTaskDuration').value = task.duration;
    document.getElementById('editTaskIndex').value = index;
    document.getElementById('editTaskPopup').style.display = 'block';
}

function closeEditTaskPopup() {
    document.getElementById('editTaskPopup').style.display = 'none';
}

function saveEditedTask() {
    const index = document.getElementById('editTaskIndex').value;
    const taskName = document.getElementById('editTaskName').value;
    const deadline = document.getElementById('editDeadline').value;
    const taskPriorityW = document.getElementById('editTaskPriorityW').checked;
    const taskPriorityD = document.getElementById('editTaskPriorityD').checked;
    const taskDuration = document.getElementById('editTaskDuration').value;

    if (taskName && deadline) {
        tasks[index].task = taskName;
        tasks[index].dueDate = deadline;
        tasks[index].wichtig = taskPriorityW;
        tasks[index].dringend = taskPriorityD;
        tasks[index].duration = parseInt(taskDuration) || 0;
        saveTasks();
        loadTasks();
        
        // Pop-Up-Formular schließen
        closeEditTaskPopup();
    } else {
        alert('Bitte fülle alle Felder aus.');
    }
}

function deleteTaskFromPopup() {
    const index = document.getElementById('editTaskIndex').value;
    if (confirm("Bist du sicher, dass du dieses To-Do löschen möchtest?")) {
        tasks.splice(index, 1);
        saveTasks();
        loadTasks();
        closeEditTaskPopup();
    }
}

function openAddTaskPopup() {
    document.getElementById('addTaskPopup').style.display = 'block';
}

function closeAddTaskPopup() {
    document.getElementById('addTaskPopup').style.display = 'none';
}
