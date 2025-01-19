let allTasks = [];
let scrollInterval;
let scrollSpeed = 25;


/**
 * This function is used to load all Tasks from backend
 */
async function getAllTasks() {
  loadedTasks = await getTasksArray();
  allTasks = loadedTasks;
}


/**
 * This function is used to navigate the browser to the previous page.
 */
function goBack() {
    history.back();
}


/**
 * This function is used to simulate a click event on a button with the given ID.
 * @param {string} buttonId - The ID of the button to be clicked.
 */
function simulateClickButton(buttonId) {
    const button = document.getElementById(buttonId);
    button.click();
}


/**
 * This function is used to set the current status to the given state.
 * @param {string} state - The state to set as the current status.
 */
function getCurrentStatus(state) {
    currentStatus = state;
}


document.addEventListener('DOMContentLoaded', (event) => {
  initialize();

  const observer = createMutationObserver();
  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
});


/**
* This function is used to initialize event listeners.
*/
function initialize() {
  addEventListeners();
}


/**
* This function is used to add event listeners to the form and input elements.
*/
function addEventListeners() {
  const addTaskForm = document.getElementById('add-task-form');
  const subtasksInput = document.getElementById('subtasks-input');
  
  if (addTaskForm) {
      preventFormSubmitOnEnter(addTaskForm);
  }
  
  if (subtasksInput) {
      handleSubtasksInput(subtasksInput);
  }
}


/**
* This function is used to prevent the form from submitting when the Enter key is pressed.
*
* @param {HTMLElement} formElement - The form element.
*/
function preventFormSubmitOnEnter(formElement) {
  formElement.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
          e.preventDefault();
      }
  });
}


/**
* This function is used to handle the Enter key press event for the subtasks input.
*
* @param {HTMLElement} inputElement - The input element for subtasks.
*/
function handleSubtasksInput(inputElement) {
  inputElement.addEventListener('keydown', function(e) {
      let inputValue = inputElement.value;
      if (e.key === 'Enter' && inputValue !== '') {
          addSubtaskToPopup('addTask', '');
          clearSubtaskInput('addTask', '');
          checkInput('addTask', '');
      }
  });
}


/**
* This function is used to create a MutationObserver to monitor changes in the DOM.
*
* @returns {MutationObserver} The configured MutationObserver instance.
*/
function createMutationObserver() {
  const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              if (document.getElementById('add-task-form')) {
                  addEventListeners();
                  observer.disconnect();
              }
          }
      });
  });
  return observer;
}


/**
 * This function is used to fetch all tasks and sets them to the global variable 'allTasks'.
 */
async function getAllTasks() {
    loadedTasks = await getTasksArray();
    allTasks = loadedTasks;
}


/**
 * This function is used to show or hide a movable container based on the given parameters.
 * @param {string} parameter - 'show' to display the container, 'remove' to hide it.
 * @param {string} container - The container to be shown or hidden ('addTask' or 'bigCard').
 */
function showMovableContainer(parameter, container) {
    if (parameter == 'show' && container == 'addTask') {
        document.body.style.overflow = 'hidden';
        document.getElementById('add-task-container').classList.add('show-moveable');
        document.getElementById('add-task-container').classList.remove('remove-moveable');
    } else if (parameter == 'remove' && container == 'addTask') {
        document.body.style.overflow = '';
        document.getElementById('add-task-container').classList.add('remove-moveable');
        document.getElementById('add-task-container').classList.remove('show-moveable');
    } else if (parameter == 'show' && container == 'bigCard') {
        document.body.style.overflow = 'hidden';
        document.getElementById('big-card-background').classList.add('show-moveable');
        document.getElementById('big-card-background').classList.remove('remove-moveable');
    } else if (parameter == 'remove' && container == 'bigCard') {
        document.body.style.overflow = '';
        document.getElementById('big-card-background').classList.remove('show-moveable');
        document.getElementById('big-card-background').classList.add('remove-moveable');
    }
}


/**
 * This function is used to reset the assigned contacts to an empty array.
 */
function resetAssignTo() {
    assignedContacts = [];
}


/**
 * This function is used to select the default priority by simulating a click on the button with the given ID.
 * @param {string} buttonId - The ID of the button to select the default priority.
 */
function selectDefaultPrio(buttonId) {
  simulateClickButton(buttonId);
}


/**
 * This function is used to start touching a task via touch.
 * 
 * @param {number} id - The unique id of the task.
 * @param {object} event - The touch event object.
 */
function startTouching(id, event) {
    touchTimer = setTimeout(() => {
        isTouchMoving = true;
        currentTouchedItem = id;
        const draggedElement = document.getElementById(id);
        if (draggedElement) {
            draggedElement.classList.add('dragging');
        }
        const touch = event.touches[0];
        const rect = draggedElement.getBoundingClientRect();
        touchOffsetX = rect.width / 2;
        touchOffsetY = rect.height / 2;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, 1000);
    event.target.addEventListener('touchend', cancelTouching, { once: true });
}


/**
 * This function is used to cancel the touch action if it ends before the timer triggers.
 */
function cancelTouching() {
    clearTimeout(touchTimer);
}


/**
 * This function is used to handle the touch move event to drag the task element.
 * 
 * @param {TouchEvent} ev - The touch event object.
 */
function touchMove(ev) {
    if (!isTouchMoving) return;
    const touch = ev.touches[0];
    const draggedElement = document.getElementById(currentTouchedItem);
    ev.preventDefault();
    if (draggedElement) {
        const clientRect = draggedElement.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        const scrollZoneHeight = screenHeight * 0.2; // Adjust scroll zone height as needed
        if (touch.clientY < scrollZoneHeight && window.scrollY > 0) {
            // Dragged to top scroll zone
            startScrolling(-1); // Start scrolling upwards
        } else if (touch.clientY > screenHeight - scrollZoneHeight && window.scrollY < document.body.scrollHeight - screenHeight) {
            // Dragged to bottom scroll zone
            startScrolling(1); // Start scrolling downwards
        } else {
            stopScrolling(); // Stop scrolling if not in top or bottom scroll zone
        }
        moveDraggedElement(touch, draggedElement);
    }
    highlightTargetColumn(touch);
}


/**
 * Start scrolling continuously in a specified direction.
 * 
 * @param {number} direction - The direction of scrolling (-1 for upwards, 1 for downwards).
 */
function startScrolling(direction) {
    stopScrolling(); // Stop any ongoing scrolling first
    scrollInterval = setInterval(() => {
        window.scrollBy(0, direction * scrollSpeed);
    }, 100); // Adjust scroll interval as needed
}


/**
 * Stop any ongoing scrolling.
 */
function stopScrolling() {
    clearInterval(scrollInterval);
}


/**
 * This function is used to move the dragged element according to the touch position.
 * 
 * @param {Touch} touch - The touch object representing the touch position.
 * @param {HTMLElement} draggedElement - The element being dragged.
 */
function moveDraggedElement(touch, draggedElement) {
    draggedElement.style.position = 'absolute';
    draggedElement.style.left = `${touch.clientX - touchOffsetX}px`;
    draggedElement.style.top = `${touch.clientY - touchOffsetY + window.scrollY}px`;
}


/**
 * This function is used to highlight the target column based on the touch position.
 * 
 * @param {Touch} touch - The touch object representing the touch position.
 */
function highlightTargetColumn(touch) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element) {
        if (element.classList.contains('todo-column')) {
            highlight('todo-column');
        } else if (element.classList.contains('progress-column')) {
            highlight('progress-column');
        } else if (element.classList.contains('await-column')) {
            highlight('await-column');
        } else if (element.classList.contains('done-column')) {
            highlight('done-column');
        } else {
            removeHighlight('todo-column');
            removeHighlight('progress-column');
            removeHighlight('await-column');
            removeHighlight('done-column');
        }
    }
}


/**
 * This function is used to handle the touch end event to finalize the task movement.
 * 
 * @param {TouchEvent} ev - The touch event object.
 */
async function touchEnd(ev) {
    if (!isTouchMoving) {
        clearTimeout(touchTimer);
        return;
    }
    const touch = ev.changedTouches[0];
    const targetColumn = findTargetColumn(touch);
    await moveTo(targetColumn);
    resetDraggedElement();
    resetTouchVariables();
    removeHighlightFromColumns();
}


/**
 * This function is used to find the target column based on the touch position.
 * 
 * @param {Touch} touch - The touch object representing the touch position.
 * @returns {string} The class name of the target column.
 */
function findTargetColumn(touch) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.classList.contains('todo-column')) {
        return 'todo';
    } else if (element && element.classList.contains('progress-column')) {
        return 'progress';
    } else if (element && element.classList.contains('await-column')) {
        return 'await';
    } else if (element && element.classList.contains('done-column')) {
        return 'done';
    }
    return '';
}


/**
 * This function is used to reset the dragged element's styles and touch related variables.
 */
function resetDraggedElement() {
    const draggedElement = document.getElementById(currentTouchedItem);

    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement.style.transform = 'none';
        draggedElement.style.position = 'static';
    }
}


/**
 * This function is used to reset touch related variables after touch end event.
 */
function resetTouchVariables() {
    currentTouchedItem = null;
    currentDraggedItem = null;
    touchStartX = 0;
    touchStartY = 0;
    touchOffsetX = 0;
    touchOffsetY = 0;
    isTouchMoving = false;
}


/**
 * This function is used to remove highlight from all task columns.
 */
function removeHighlightFromColumns() {
    removeHighlight('todo-column');
    removeHighlight('progress-column');
    removeHighlight('await-column');
    removeHighlight('done-column');
}