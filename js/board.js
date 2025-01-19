let currentDraggedItem = null;
let filterdtasks = [];
let loadedTasks = [];
let currentContactColor = 'black';
let allContactsExist = [];


/**
 * This function initialise all relevant data
 */
async function init() {
    await initPage();
    await loadAllData();
    await getAllTasks();
    await loadAllContacts();
    loadCards();
    getProfileInitials();
}


/**
 * This function starts the loading functions to render all Tasks to the Kanban Board
 */
function loadCards() {
    loadTodoCards();
    loadProgressCards();
    loadAwaitCards();
    loadDoneCards();
}


/**
 * This function filters all tasks with status todo and render it in the todo-column
 */
function loadTodoCards() {
    let todo = allTasks.filter(t => t['status'] == 'todo');
    document.getElementById('todo-column').innerHTML = '';
    if (todo.length !== 0) {
        for (let i = 0; i < todo.length; i++) {
            const card = todo[i];
            document.getElementById('todo-column').innerHTML += generateTaskHTML(card);
            calculateProgressBar(card);
        }
    } else {
        document.getElementById('todo-column').innerHTML += generateEmptyColumnHTML('To do');
    };
}


/**
 * This function filters all tasks with status progress and render it in the progress-column
 */
function loadProgressCards() {
    let progress = allTasks.filter(t => t['status'] == 'progress');
    document.getElementById('progress-column').innerHTML = '';
    if (progress.length !== 0) {
        for (let i = 0; i < progress.length; i++) {
            const card = progress[i];
            document.getElementById('progress-column').innerHTML += generateTaskHTML(card);
            calculateProgressBar(card);
        }
    } else {
        document.getElementById('progress-column').innerHTML += generateEmptyColumnHTML('in progress');
    }
}


/**
 * This function filters all tasks with status await and render it in the await-column
 */
function loadAwaitCards() {
    let feedback = allTasks.filter(t => t['status'] == 'await');
    document.getElementById('await-column').innerHTML = '';
    if (feedback.length !== 0) {
        for (let i = 0; i < feedback.length; i++) {
            const card = feedback[i];
            document.getElementById('await-column').innerHTML += generateTaskHTML(card);
            calculateProgressBar(card);
        }
    } else {
        document.getElementById('await-column').innerHTML += generateEmptyColumnHTML('await feedback');
    }
}


/**
 * This function filters all tasks with status done and render it in the done-column
 */
function loadDoneCards() {
    let done = allTasks.filter(t => t['status'] == 'done');
    document.getElementById('done-column').innerHTML = '';
    if (done.length !== 0) {
        for (let i = 0; i < done.length; i++) {
            const card = done[i];
            document.getElementById('done-column').innerHTML += generateTaskHTML(card);
            calculateProgressBar(card);
        }
    } else {
        document.getElementById('done-column').innerHTML += generateEmptyColumnHTML('done');
    }
}


/**
 * This function find the respective task using the task id and renders the big task view
 * 
 * @param {number} cardId This contains the unique id of the task
 */
function renderBigCard(cardId) {
    let container = document.getElementById('big-card-container');
    let currentCard = allTasks.find(todo => todo.id === cardId);
    container.innerHTML = '';

    if (currentCard) {
        container.innerHTML = generateHTMLbigCard(currentCard);
    } else {
        console.error("Card not found");
    }
    checkCategory(currentCard);
    getAssigntContactsFromTask(cardId);
}


/**
 * This function is used to edit a task and render the new edit task in the big task view
 * 
 * @param {number} indexOfCurTask This contains the index of the respective task
 */
async function editTask(indexOfCurTask) {
    let taskInfo = getTaskInformations(indexOfCurTask);
    for (let i = 0; i < taskInfo.oldSubtasks.length; i++) {
        const subtask = taskInfo.oldSubtasks[i];
        currentSubtasks.push(subtask);
    }
    let task = creatTask(taskInfo.assignedTo, taskInfo.category, taskInfo.date, taskInfo.description, taskInfo.prio, taskInfo.status, currentSubtasks, taskInfo.title
    );
    task['id'] = taskInfo.cardId;
    await editTasks(indexOfCurTask, task);
    await getAllTasks();
    loadCards();
    resetForm();
    renderBigCard(taskInfo.cardId);
}


/**
 * This function is used to get all the informations from the task with the specific index
 * 
 * @param {number} indexOfCurTask This contains the index of the respective task
 * @returns 
 */
function getTaskInformations(indexOfCurTask) {
    let cardId = allTasks[indexOfCurTask]['id'];
    let title = document.getElementById("input-title" + indexOfCurTask).value;
    let description = document.getElementById("input-description" + indexOfCurTask).value;
    let assignedTo = getAssigntContactsNames();
    let date = document.getElementById("input-date" + indexOfCurTask).value;
    let category = allTasks[indexOfCurTask]['category'];
    let oldSubtasks = allTasks[indexOfCurTask]['subTasks'];
    let status = allTasks[indexOfCurTask]['status'];
    let prio = currentPrio;

    return {cardId, title, description, assignedTo, date, category, oldSubtasks, status, prio
    };
}


/**
 * This function is used to show the edit task editor
 * 
 * @param {number} id This contains the unique id of the task
 */
function showEditTask(id) {
    let container = document.getElementById('big-card-container');
    let indexOfCurTask = allTasks.findIndex(t => t.id === id);
    currentPrio = allTasks[indexOfCurTask]['prio'];
    container.innerHTML = generateHTMLEditTask(indexOfCurTask);
    if (currentPrio == 'Low') {
        selectDefaultPrio('button-low');
    } else if (currentPrio == 'Medium') {
        selectDefaultPrio('button-medium');
    } else {
        selectDefaultPrio('button-urgent');
    }
    renderSelectedContacts();
    showContactsToAssign(event);
    simulateClickButton('input-assignTo');
}


/**
 * This function is used to get the input field value and start the filtering function
 */
async function taskSearch() {
    let inputfield = document.getElementById('search-input').value;
    let input = inputfield.trim().toLowerCase();
    filteredTasks = [];
    allTasks = loadedTasks;

    if (input.length >= 0) {
        checkTasks(input, filteredTasks);
    }
    else if (input.length == 0) {
        loadCards();
    }
}


/**
 * This function is used to filter all tasks on the basis of the input field value
 * 
 * @param {string} filter This contains the input field value
 * @param {Array} filteredTasks This contains all filtered tasks
 */
function checkTasks(filter, filteredTasks) {
    for (let i = 0; i < allTasks.length; i++) {
        const curTask = allTasks[i];
        const title = curTask['title'].toLowerCase();
        const description = curTask['description'].toLowerCase();
        if (title.includes(filter) || description.includes(filter)) {
            filteredTasks.push(curTask)
        }
    }
    allTasks = filteredTasks;
    loadCards();

    if (allTasks.length === 0) {
        noTasksPopup.style.display = 'block';
    } else {
        noTasksPopup.style.display = 'none';
    }
}


/**
 * This function is used to get the id of the dragging task
 * 
 * @param {number} id This contains the unique id of the task
 */
function startDragging(id) {
    currentDraggedItem = id;
}


/**
 * This function is used to allow to drop a task in the respective column
 * 
 * @param {object} ev contains an event object
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * This function is used to move the task to the specified category column.
 * 
 * @param {string} category The name of the category column.
 */
async function moveTo(category) {
    const taskId = currentDraggedItem !== null ? currentDraggedItem : currentTouchedItem;
    const indexOfTask = allTasks.findIndex(task => task.id === taskId);
    let task = allTasks[indexOfTask];
    task.status = category;
    await editTasks(indexOfTask, task);
    await getAllTasks();
    loadCards();

    currentDraggedItem = null;
    currentTouchedItem = null;
}


/**
 * This function is used to delete a task from the board
 * 
 * @param {number} id This contains the unique id of the task
 */
async function deleteTask(id) {
    let indexOfTask = allTasks.findIndex(t => t.id === id);
    await deleteTasks(indexOfTask);
    allTasks = await getTasksArray();
    loadCards();
    showMovableContainer('remove', 'bigCard');
}


/**
 * This function is used to render all subtasks that the task contains in the task editor view
 * 
 * @param {number} cardId This contains the unique id of the task
 */
function renderEditBigCardSubtasks(cardId) {
    let indexOfCurTask = allTasks.findIndex(t => t.id === cardId);
    let subtasks = allTasks[indexOfCurTask];
    let container = document.getElementById('subtasks-popup-section' + indexOfCurTask);
    container.innerHTML = '';

    for (let i = 0; i < subtasks['subTasks'].length; i++) {
        const subtask = subtasks['subTasks'][i];

        container.innerHTML += generateHTMLsubtasksEdit(subtask, cardId);
    }
}


/**
 * This function is used to render an input field to edit a single subtask
 * 
 * @param {string} subtaskTitle this contains the subtask title
 * @param {number} id This contains an id to set unique div ids
 * @param {number} cardId This contains the unique id of the task
 */
function editSubtaskBigCard(subtaskTitle, id, cardId) {
    const container = document.getElementById(`subtask-popup-edit-container${id}`);
    const subtaskHTML = generateSubtaskEditBigCardHTML(subtaskTitle, id, cardId);

    container.innerHTML = subtaskHTML;
}


/**
 * This function is used to save the changes that are made by editing a subtask
 * 
 * @param {number} id This contains an id to set unique div ids
 * @param {number} cardId This contains the unique id of the task
 */
async function saveChangedSubtaskInEditor(id, cardId) {
    let indexOfCurTask = allTasks.findIndex(t => t.id == cardId);
    let indexOfCurSubTask = allTasks[indexOfCurTask]['subTasks'].findIndex(s => s.id == id);
    let newTitle = document.getElementById('subtaskInput'+id).value;
    let subtask = creatSubTask(newTitle, checked = "unchecked");

    await editSubTasks(indexOfCurTask, indexOfCurSubTask, subtask);
    await getAllTasks();
    renderEditBigCardSubtasks(cardId);
}


/**
 * This function is used to add subtasks in the task editor view
 * 
 * @param {number} indexOfCurTask This contains the index of the respective task
 */
async function addSubtaskInEditor(indexOfCurTask) {
    let cardId = allTasks[indexOfCurTask]['id'];
    let subtitle = document.getElementById('subtasks-input'+indexOfCurTask).value;
    let subtask = creatSubTask(subtitle, checked = "unchecked");

    await addSubTasks(indexOfCurTask, subtask);
    await getAllTasks();
    renderEditBigCardSubtasks(cardId);
}


/**
 * This function is used to delete subtasks in the task editor view
 * 
 * @param {*} SubtaskId This contains the unique id of the subtask
 * @param {*} cardId This contains the unique id of the task
 */
async function deleteEditSubtask(SubtaskId, cardId) {
    let indexOfCurTask = allTasks.findIndex(t => t.id == cardId);
    let indexOfCurSubTask = allTasks[indexOfCurTask]['subTasks'].findIndex(s => s.id == SubtaskId);

    await deleteSubTasks(indexOfCurTask, indexOfCurSubTask);
    await getAllTasks();
    renderEditBigCardSubtasks(cardId);
}


/**
 * This function is used to save all subtasks that are checked
 * 
 * @param {*} cardId This contains the unique id of the task
 * @param {*} subtaskIndex This contains the index of the respective subtask
 * @param {*} subtaskName This contains the subtask name
 */
async function saveCheckedSubtask(cardId, subtaskIndex, subtaskName) {
    let indexOfTask = allTasks.findIndex(task => task.id === cardId);
    let SubtaskStatus = allTasks[indexOfTask]['subTasks'][subtaskIndex]['checked'];
    let newSubtaskStatus = '';
    if (SubtaskStatus === 'unchecked') {
        newSubtaskStatus = 'checked';
    } else {
        newSubtaskStatus = 'unchecked';
    }
    let changedSubtask = creatSubTask(subtaskName, newSubtaskStatus);
    await editSubTasks(indexOfTask, subtaskIndex, changedSubtask);
    await getAllTasks();
    loadCards();
}