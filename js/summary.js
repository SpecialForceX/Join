let dateArray = [];


/**
 * This function is used to initializes the summary by loading data and setting up the user interface.
 */
async function initSummary() {
    greetingMobile();
    await initInclude();
    await loadAllData();
    await getAllTasks();
    logedUserDataArray = await getLoginDataArray();
    logedUser = loadLocal('activUser');
    loadAmountsInSummary();
    setDayTime();
    logedUserData();
    getProfileInitials();
}


/**
 * This function is used to load the amounts of different task categories into the summary.
 */
function loadAmountsInSummary() {
    document.getElementById('todo-amount').innerHTML = getAmountOfTodos();
    document.getElementById('done-amount').innerHTML = getAmountOfDone();
    document.getElementById('prio-amount').innerHTML = getUrgentDates();
    document.getElementById('deadline').innerHTML = getEarliestDate();
    document.getElementById('amount-tasks-in-board').innerHTML = getAmountOfAllTasks();
    document.getElementById('amount-tasks-progress').innerHTML = getProgressTasks();
    document.getElementById('amount-tasks-feedback').innerHTML = getFeedbackTasks();
}


/**
 * This function is used to get the number of tasks with status 'todo'.
 * 
 * @returns {number} The number of 'todo' tasks.
 */
function getAmountOfTodos() {
    let todo = allTasks.filter(t => t['status'] == 'todo');
    return todo.length;
}


/**
 * This function is used to get the number of tasks with status 'done'.
 * 
 * @returns {number} The number of 'done' tasks.
 */
function getAmountOfDone() {
    let done = allTasks.filter(t => t['status'] == 'done');
    return done.length;
}


/**
 * This function is used to get the number of tasks with priority 'Urgent' and stores their dates.
 * 
 * @returns {number} The number of urgent tasks.
 */
function getUrgentDates() {
    let allUrgent = allTasks.filter(t => t['prio'] == 'Urgent');
    dateArray = [];

    for (let i = 0; i < allUrgent.length; i++) {
        const urgent = allUrgent[i];
        
        let urgentDate = urgent['date'];
        dateArray.push(urgentDate);
    }

    return allUrgent.length;
}


/**
 * This function is used to get the earliest date from the list of urgent task dates.
 * 
 * @returns {string|null} The earliest date formatted, or null if no dates are available.
 */
function getEarliestDate() {
    getUrgentDates();
    let currentDate = new Date();
    dateArray.sort((a, b) => new Date(a) - new Date(b));
    for (let date of dateArray) {
        if (new Date(date) > currentDate) {
            return formatDate(date);
        }
    }

    if (dateArray.length > 0) {
        return formatDate(dateArray[0]);
    }

    return null;
}


/**
 * This function is used to format a date string into a more readable format.
 * 
 * @param {string} dateStr - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateStr) {
    let date = new Date(dateStr);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
  
    return date.toLocaleDateString('en-US', options);
}


/**
 * This function is used to get the total number of tasks.
 * 
 * @returns {number} The total number of tasks.
 */
function getAmountOfAllTasks() {
    return allTasks.length;
}


/**
 * This function is used to get the number of tasks with status 'progress'.
 * 
 * @returns {number} The number of 'progress' tasks.
 */
function getProgressTasks() {
    let progress = allTasks.filter(t => t['status'] == 'progress');
    return progress.length;
}


/**
 * This function is used to get the number of tasks with status 'await'.
 * 
 * @returns {number} The number of 'await' tasks.
 */
function getFeedbackTasks() {
    let feedback = allTasks.filter(t => t['status'] == 'await');
    return feedback.length;
}


/**
 * This function is used to set the greeting message based on the current time of day.
 */
function setDayTime() {
    let greetingElement = document.getElementById('greeting-user');
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let greeting;
  
    if (hours >= 5 && hours < 12) {
      greeting = "Good morning,";
    } else if (hours >= 12 && hours < 18) {
      greeting = "Good afternoon,";
    } else if (hours >= 18 && hours < 22) {
      greeting = "Good evening,";
    } else {
      greeting = "Good night,";
    }
    greetingElement.textContent = greeting;
}


/**
 * This function is used to load the logged user data and sets the greeting message with the user's name.
 */
function logedUserData() {
    let greetingUserElement = document.getElementById('loged-user');
    let userIndex = logedUserDataArray.findIndex(u => u.id == logedUser);
    let user = logedUserDataArray[userIndex];

    if (userIndex >= 0) {
        let { name } = extractInitialsAndName(user);
        greetingUserElement.textContent = name;
    } else {
        greetingUserElement.textContent = "Guest";
    }
}


/**
 * This function is used to display a greeting message for mobile users if the previous page was 'login'.
 */
function greetingMobile() {
    let previousPage = getFromSessionStorage('page');
    let container = document.getElementById('greeting-container');
    
    if (previousPage === 'login' && window.innerWidth < 1024) {
        if (container) {
            container.classList.add('show');
            container.style.display = 'flex';

            setTimeout(() => {
                container.style.opacity = '0';
                setTimeout(() => {
                    container.style.display = 'none';
                    container.classList.remove('show');
                }, 2000);
            }, 2000);
        }
    }
}


/**
 * This function is used to retrieve a value from the session storage.
 * 
 * @param {string} key - The key of the value to retrieve.
 * @returns {any} The retrieved value.
 */
function getFromSessionStorage(key) {
    let value = sessionStorage.getItem(key);
    return value ? value : null;
}