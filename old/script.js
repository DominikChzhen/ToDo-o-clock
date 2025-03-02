document.addEventListener("DOMContentLoaded", () => {
    const taskCategories = {
        "Wichtig / Dringend": document.getElementById("important-urgent").querySelector(".task-list"),
        "Wichtig / Nicht dringend": document.getElementById("important-not-urgent").querySelector(".task-list"),
        "Nicht Wichtig / Dringend": document.getElementById("not-important-urgent").querySelector(".task-list"),
        "Nicht dringend / Nicht wichtig": document.getElementById("not-important-not-urgent").querySelector(".task-list")
    };
    const addTaskButton = document.getElementById("add-task");
    const startTrackerButton = document.getElementById("start-tracker");
    const taskPopup = document.getElementById("task-popup");
    const editTaskPopup = document.getElementById("edit-task-popup");
    const closePopup = document.querySelectorAll(".popup .close");
    const taskForm = document.getElementById("task-form");
    const editTaskForm = document.getElementById("edit-task-form");
    const archive = document.querySelector(".archive");
    const archiveList = document.querySelector(".archive-list");
    let currentTask = null;

    const tasks = [
        { category: "Wichtig / Dringend", name: "Creating Wireframe", time: "25:00", completed: false },
        { category: "Wichtig / Nicht dringend", name: "Research Development", time: "25:00", completed: false }
    ];

    const archivedTasks = [];

    function renderTasks() {
        Object.values(taskCategories).forEach(taskList => taskList.innerHTML = "");
        tasks.forEach((task, index) => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");
            taskItem.innerHTML = `<input type="checkbox" ${task.completed ? "checked" : ""}><span>${task.name}</span><span>${task.time}</span>`;
            taskItem.querySelector("input[type='checkbox']").addEventListener("change", () => {
                task.completed = !task.completed;
                if (task.completed) {
                    archivedTasks.push(task);
                    tasks.splice(index, 1);
                    renderTasks();
                    renderArchivedTasks();
                    archive.style.display = "block";
                }
            });
            taskItem.addEventListener("click", (event) => {
                if (event.target.tagName !== "INPUT") {
                    currentTask = index;
                    document.getElementById("edit-task-name").value = task.name;
                    document.getElementById("edit-task-important").checked = task.category.includes("Wichtig");
                    document.getElementById("edit-task-urgent").checked = task.category.includes("Dringend");
                    editTaskPopup.style.display = "block";
                }
            });
            taskCategories[task.category].appendChild(taskItem);
        });
    }

    function renderArchivedTasks() {
        archiveList.innerHTML = "";
        archivedTasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item", "completed");
            taskItem.innerHTML = `<span>${task.name}</span><span>${task.time}</span>`;
            archiveList.appendChild(taskItem);
        });
    }

    archive.addEventListener("click", () => {
        archiveList.style.display = archiveList.style.display === "none" ? "block" : "none";
    });

    addTaskButton.addEventListener("click", () => {
        taskPopup.style.display = "block";
    });

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

    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskName = document.getElementById("task-name").value;
        const taskImportant = document.getElementById("task-important").checked;
        const taskUrgent = document.getElementById("task-urgent").checked;
        let taskCategory = "Nicht dringend / Nicht wichtig";
        if (taskImportant && taskUrgent) {
            taskCategory = "Wichtig / Dringend";
        } else if (taskImportant) {
            taskCategory = "Wichtig / Nicht dringend";
        } else if (taskUrgent) {
            taskCategory = "Nicht Wichtig / Dringend";
        }
        const newTask = { category: taskCategory, name: taskName, time: "25:00", completed: false };
        tasks.push(newTask);
        renderTasks();
        taskPopup.style.display = "none";
        taskForm.reset();
    });

    editTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskName = document.getElementById("edit-task-name").value;
        const taskImportant = document.getElementById("edit-task-important").checked;
        const taskUrgent = document.getElementById("edit-task-urgent").checked;
        let taskCategory = "Nicht dringend / Nicht wichtig";
        if (taskImportant && taskUrgent) {
            taskCategory = "Wichtig / Dringend";
        } else if (taskImportant) {
            taskCategory = "Wichtig / Nicht dringend";
        } else if (taskUrgent) {
            taskCategory = "Nicht Wichtig / Dringend";
        }
        tasks[currentTask] = { ...tasks[currentTask], name: taskName, category: taskCategory };
        renderTasks();
        editTaskPopup.style.display = "none";
        editTaskForm.reset();
    });

    startTrackerButton.addEventListener("click", () => {
        alert("Time Tracker Started!");
    });

    const dateElement = document.querySelector('header .date');

    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('de-DE', options);
    };

    updateDate();

    renderTasks();
});