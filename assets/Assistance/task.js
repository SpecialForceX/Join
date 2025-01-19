let allTasks = [];

function init() {
    loadAllTasks();
    showTasks();
}

function addTask() {
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;

    let task = {
        'description': description,
        'category': category,
        'createdAt': new Date().getTime()//Unix Timestamp
    };

    allTasks.push(task);

    saveAllTasks()
    init();
}

function saveAllTasks() {
    let allTasksAsString = JSON.stringify(allTasks);
    localStorage.setItem('allTasks', allTasksAsString);
}

function loadAllTasks() {
    let allTasksAsString = localStorage.getItem('allTasks');
    allTasks = JSON.parse(allTasksAsString);

    console.log('Loaded all tasks', allTasks);
}

function showTasks() {
    let content = document.getElementById('tasks');
    content.innerHTML = "";

    for (let i = 0; i < allTasks.length; i++) {
        const TASK = allTasks[i];

        
    content.innerHTML += /*html*/ `
    <div class="tasks-box">
        <span class="description">Beschreibung: ${TASK.description}</span>
        <span class="category">Kategorie: ${TASK.category}</span>
        <span class="date">Erstellt am: ${new Date(TASK.createdAt).toLocaleString()}</span>
        <button onclick="deleteTask(${i})">DELETE</button>
    </div>
    `;
    }
}

function deleteTask(i) {
    allTasks.splice(i, 1);
    saveAllTasks();
    showTasks();
}
