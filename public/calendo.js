// Dominiks js

document.addEventListener("DOMContentLoaded", () => {
        // Navigation
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
        });
    }

    //ARCHIVE
    const archive = document.querySelector(".archive");
    const archiveList = document.querySelector(".archive-list");

    if(archive != null){
        archive.addEventListener("click", () => {
            archiveList.style.display = archiveList.style.display === "none" ? "block" : "none";
        });
    }

    // const taskCategories = {
    //     "Wichtig / Dringend": document.getElementById("important-urgent").querySelector(".task-list"),
    //     "Wichtig / Nicht dringend": document.getElementById("important-not-urgent").querySelector(".task-list"),
    //     "Nicht Wichtig / Dringend": document.getElementById("not-important-urgent").querySelector(".task-list"),
    //     "Nicht dringend / Nicht wichtig": document.getElementById("not-important-not-urgent").querySelector(".task-list")
    // };
    const addTaskButton = document.getElementById("add-task");
    const newTaskButton = document.getElementById("new-task")
    // const startTrackerButton = document.getElementById("start-tracker");
    const taskPopup = document.getElementById("task-popup");
    const editTaskPopup = document.getElementById("edit-task-popup");
    const closePopup = document.querySelectorAll(".popup .close");
    // const taskForm = document.getElementById("task-form");
    // const editTaskForm = document.getElementById("edit-task-form");
    // const archive = document.querySelector(".archive");
    // const archiveList = document.querySelector(".archive-list");
    // let currentTask = null;

    // const tasks = [
    //     { category: "Wichtig / Dringend", name: "Creating Wireframe", time: "25:00", completed: false },
    //     { category: "Wichtig / Nicht dringend", name: "Research Development", time: "25:00", completed: false }
    // ];

    // const archivedTasks = [];

    // function renderTasks() {
    //     Object.values(taskCategories).forEach(taskList => taskList.innerHTML = "");
    //     tasks.forEach((task, index) => {
    //         const taskItem = document.createElement("div");
    //         taskItem.classList.add("task-item");
    //         taskItem.innerHTML = `<input type="checkbox" ${task.completed ? "checked" : ""}><span>${task.name}</span><span>${task.time}</span>`;
    //         taskItem.querySelector("input[type='checkbox']").addEventListener("change", () => {
    //             task.completed = !task.completed;
    //             if (task.completed) {
    //                 archivedTasks.push(task);
    //                 tasks.splice(index, 1);
    //                 renderTasks();
    //                 renderArchivedTasks();
    //                 archive.style.display = "block";
    //             }
    //         });
    //         taskItem.addEventListener("click", (event) => {
    //             if (event.target.tagName !== "INPUT") {
    //                 currentTask = index;
    //                 document.getElementById("edit-task-name").value = task.name;
    //                 document.getElementById("edit-task-important").checked = task.category.includes("Wichtig");
    //                 document.getElementById("edit-task-urgent").checked = task.category.includes("Dringend");
    //                 editTaskPopup.style.display = "block";
    //             }
    //         });
    //         taskCategories[task.category].appendChild(taskItem);
    //     });
    // }

    // function renderArchivedTasks() {
    //     archiveList.innerHTML = "";
    //     archivedTasks.forEach(task => {
    //         const taskItem = document.createElement("div");
    //         taskItem.classList.add("task-item", "completed");
    //         taskItem.innerHTML = `<span>${task.name}</span><span>${task.time}</span>`;
    //         archiveList.appendChild(taskItem);
    //     });
    // }

    // archive.addEventListener("click", () => {
    //     archiveList.style.display = archiveList.style.display === "none" ? "block" : "none";
    // });

    addTaskButton.addEventListener("click", () => {
        taskPopup.style.display = "block";
    });

    newTaskButton.addEventListener("click", () => {
        taskPopup.style.display = "block";
    })

    closePopup.forEach(btn => {
        btn.addEventListener("click", () => {
            taskPopup.style.display = "none";
            editTaskPopup.style.display = "none";
        });
    });

    window.addEventListener("click", (event) => {
        if (event.target === taskPopup || event.target === editTaskPopup) {
            taskPopup.style.display = "none";
            editTaskPopup.style.display = "none";
        }
    });

    // taskForm.addEventListener("submit", (event) => {
    //     event.preventDefault();
    //     const taskName = document.getElementById("task-name").value;
    //     const taskImportant = document.getElementById("task-important").checked;
    //     const taskUrgent = document.getElementById("task-urgent").checked;
    //     let taskCategory = "Nicht dringend / Nicht wichtig";
    //     if (taskImportant && taskUrgent) {
    //         taskCategory = "Wichtig / Dringend";
    //     } else if (taskImportant) {
    //         taskCategory = "Wichtig / Nicht dringend";
    //     } else if (taskUrgent) {
    //         taskCategory = "Nicht Wichtig / Dringend";
    //     }
    //     const newTask = { category: taskCategory, name: taskName, time: "25:00", completed: false };
    //     tasks.push(newTask);
    //     renderTasks();
    //     taskPopup.style.display = "none";
    //     taskForm.reset();
    // });

    // editTaskForm.addEventListener("submit", (event) => {
    //     event.preventDefault();
    //     const taskName = document.getElementById("edit-task-name").value;
    //     const taskImportant = document.getElementById("edit-task-important").checked;
    //     const taskUrgent = document.getElementById("edit-task-urgent").checked;
    //     let taskCategory = "Nicht dringend / Nicht wichtig";
    //     if (taskImportant && taskUrgent) {
    //         taskCategory = "Wichtig / Dringend";
    //     } else if (taskImportant) {
    //         taskCategory = "Wichtig / Nicht dringend";
    //     } else if (taskUrgent) {
    //         taskCategory = "Nicht Wichtig / Dringend";
    //     }
    //     tasks[currentTask] = { ...tasks[currentTask], name: taskName, category: taskCategory };
    //     renderTasks();
    //     editTaskPopup.style.display = "none";
    //     editTaskForm.reset();
    // });

    // startTrackerButton.addEventListener("click", () => {
    //     alert("Time Tracker Started!");
    // });

    const dateElement = document.querySelector('header .date');

    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-GB', options);
    };

    updateDate();

    // renderTasks();
});


// Julias js
let timerPopup
function openTimerPopup() {
    timerPopup = window.open('/pomodoro.html', 'Pomodoro Timer', 'width=1370 height=600, scrollbars=no');

    window.addEventListener('message', function (event) {
        if (event.origin === window.origin) { // Sicherheitscheck der Ursprungsadresse
            const { hoursToday } = event.data; // Empfange Daten vom Popup
            const hoursTodayElement = document.getElementById('hoursToday');
            if (hoursTodayElement && hoursToday != null) {
                hoursTodayElement.textContent = hoursToday.toFixed(2);
            }
        }
    });
}

// Funktion zum Öffnen des Popups zum Bearbeiten eines Tasks
function openEditPopup(id, name, duration, isImportant, isUrgent) {
    const form = document.getElementById("edit-task-form");
    form.action = `/todos/${id}?_method=PUT`; // Formular-Action setzen

    document.getElementById("edit-task-id").value = id;
    document.getElementById("edit-task-name").value = name;
    document.getElementById("edit-task-duration").value = duration;

    // Strings "true"/"false" zurück in Boolean-Werte umwandeln
    document.getElementById("edit-task-important").checked = isImportant === "true";
    document.getElementById("edit-task-urgent").checked = isUrgent === "true";

    document.getElementById("edit-task-popup").style.display = "block"; // Popup anzeigen
}


// Christophers js

// Speichere die aktuelle Scroll-Position im sessionStorage
window.addEventListener("beforeunload", function () {
    sessionStorage.setItem("scrollPos", window.scrollY);
});

// Setze die Scroll-Position beim Laden der Seite
window.addEventListener("load", function () {
    const scrollPos = sessionStorage.getItem("scrollPos");
    if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos, 10));
        sessionStorage.removeItem("scrollPos"); // Option: Entferne den Wert, falls nicht mehr benötigt
    }
});

//Konstantins js
function handleLogoutClick(event) {
    event.preventDefault()

    fetch('/logout', {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            if (timerPopup && !timerPopup.closed) {
                timerPopup.close();
                timerPopup = null;
            }
            window.location.href = '/'; 
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
}

document.getElementById('logoutLink').addEventListener('click', handleLogoutClick);