let currentPrio = "Medium";
let currentStatus;
let currentSubtasks = [];
let assignedContactsList = [];
let assignedContacts = [];
let filteredContactsList = [];


/**
 * Initializes the page by loading all data and setting event listeners.
 * @returns {Promise<void>}
 */
async function initPage() {
  await loadAllData();
  await initInclude();
  assignedContactsList = await getContactsArray();
  filteredContactsList = assignedContactsList;
  setEventlister();
  setupEventListeners();
  initializeDateInput();
  getProfileInitials();
}


/**
 * This function is used to add a task with the provided details.
 * 
 * @param {string} parameter - The parameter indicating the type of task to add.
 * @returns {Promise<void>}
 */
async function addTask(parameter) {
  setCurrentStatus(parameter);
  const taskDetails = getTaskDetails();
  taskDetails.category = determineCategory(taskDetails.categoryTxt);

  testTask();
  const task = creatTask(taskDetails.assignTo, taskDetails.category, taskDetails.date, taskDetails.description, taskDetails.prio, taskDetails.status, currentSubtasks, taskDetails.title);

  await addTasks(task);
  resetForm();

  if (parameter === "board") {
      await handleBoardRedirection();
  } else {
      handleDefaultRedirection();
  }
}


/**
* This function is used to set the current status based on the parameter.
*
* @param {string} parameter - The parameter indicating the type of task to add.
*/
function setCurrentStatus(parameter) {
  if (parameter === "addTask") {
      currentStatus = "todo";
  }
}


/**
* This function is used to retrieve task details from the form inputs.
*
* @returns {Object} An object containing the task details.
*/
function getTaskDetails() {
  return {
      title: document.getElementById("input-title").value,
      description: document.getElementById("input-description").value,
      assignTo: getAssigntContactsNames(),
      date: document.getElementById("input-date").value,
      categoryTxt: document.getElementById("input-category").value,
      prio: currentPrio,
      status: currentStatus
  };
}


/**
* This function is used to determine the category based on the category text.
*
* @param {string} categoryTxt - The category text from the input.
* @returns {boolean} The determined category.
*/
function determineCategory(categoryTxt) {
  return categoryTxt === "User Story";
}


/**
* This function is used to handle redirection when the parameter is "board".
*
* @returns {Promise<void>}
*/
async function handleBoardRedirection() {
  await getAllTasks();
  loadCards();
  showAddTaskConfirmation("board");
}


/**
* This function is used to handle the default redirection.
*/
function handleDefaultRedirection() {
  showAddTaskConfirmation("");
  setTimeout(() => {
      window.location.href = "/html/board.html";
  }, 1000);
}


/**
 * This function is used to add a task to the board.
 */
function addTaskToBoard() {
  getCurrentStatus("todo");
  addTask("");
}


/**
 * This function is used to retrieve the names of assigned contacts.
 * 
 * @returns {Array<string>} An array of assigned contact names.
 */
function getAssigntContactsNames() {
  let assigntToNames = [];
  for (let i = 0; i < assignedContacts.length; i++) {
    const contact = assignedContacts[i];
    let assigntToName = contact.id;

    assigntToNames.push(assigntToName);
  }
  return assigntToNames;
}


/**
 * This function is used to display the task confirmation message.
 * 
 * @param {string} parameter - The parameter indicating the context of the task addition.
 */
function showAddTaskConfirmation(parameter) {
  let confirmation = document.getElementById(
    "add-task-confirmation-background"
  );

  confirmation.style.display = "flex";

  if (parameter == "board") {
    setTimeout(function () {
      confirmation.style.display = "none";
      showMovableContainer("remove", "addTask");
    }, 1000);
  } else {
    setTimeout(function () {
      confirmation.style.display = "none";
    }, 1000);
  }
}


/**
 * This function is used to reset the form fields after submitting the task.
 */
function resetForm() {
  let title = (document.getElementById("input-title").value = "");
  let description = (document.getElementById("input-description").value = "");
  assignedContacts = [];
  let date = (document.getElementById("input-date").value = "");
  let categoryTxt = (document.getElementById("input-category").value = "");
  currentSubtasks = [];
  document.getElementById("subtasks-popup-section").innerHTML = "";
  renderSelectedContacts();
  selectDefaultPrio("button-medium");
}


/**
 * This function is used to add a subtask to the task popup.
 * 
 * @param {string} parameter - The parameter indicating the type of task.
 * @param {number} index - The index of the task.
 */
function addSubtaskToPopup(parameter, index) {
  let subtitle;
  if (parameter === "addTask") {
    subtitle = document.getElementById("subtasks-input").value;
  } else {
    subtitle = document.getElementById("subtasks-input").value;
  }

  let subtask = creatSubTask(subtitle, (checked = "unchecked"));
  currentSubtasks.push(subtask);
  renderSubtasksInPopup(parameter, index);
}


/**
 * This function is used to render the subtasks in the task popup.
 * 
 * @param {string} parameter - The parameter indicating the type of task.
 * @param {number} index - The index of the task.
 */
function renderSubtasksInPopup(parameter, index) {
  let container;
  if (parameter === "addTask") {
    container = document.getElementById("subtasks-popup-section");
    container.innerHTML = "";
  } else {
    container = document.getElementById("subtasks-popup-section");
  }

  for (let i = 0; i < currentSubtasks.length; i++) {
    const subtask = currentSubtasks[i];

    container.innerHTML += generateHTMLsubtasksPopup(subtask);
  }
}


/**
 * This function is used to edit a subtask.
 * 
 * @param {string} subtaskTitle - The title of the subtask.
 * @param {number} id - The ID of the subtask.
 */
function editSubtask(subtaskTitle, id) {
  const container = document.getElementById(`subtask-popup-edit-container${id}`);
  const subtaskHTML = generateSubtaskHTML(subtaskTitle, id);
  container.innerHTML = subtaskHTML;
}


/**
 * This function is used to save the changes made to a subtask.
 * 
 * @param {number} id - The ID of the subtask.
 */
function saveChangedSubtask(id) {
  let indexOfCurSubTask = currentSubtasks.findIndex((i) => i.id == id);
  let newTitle = document.getElementById("subtaskInput" + id).value;

  currentSubtasks[indexOfCurSubTask]["subtitle"] = newTitle;
  renderSubtasksInPopup("addTask", "");
}


/**
 * This function is used to delete a subtask.
 * 
 * @param {object} subtask - The subtask to be deleted.
 */
function deleteSubtask(subtask) {
  let indexOfCurSubTask = currentSubtasks.findIndex((item) => item === subtask);
  currentSubtasks.splice(indexOfCurSubTask, 1);
  renderSubtasksInPopup("addTask", "");
}


/**
 * This function is used to clear the subtask input field.
 * 
 * @param {string} parameter - The parameter indicating the type of task.
 * @param {number} index - The index of the task.
 */
function clearSubtaskInput(parameter, index) {
  if (parameter === "addTask") {
    document.getElementById("subtasks-input").value = "";
  } else {
    document.getElementById("subtasks-input" + index).value = "";
  }
}


/**
 * This function is used to check if the subtask input field is empty.
 * 
 * @param {string} parameter - The parameter indicating the type of task.
 * @param {number} index - The index of the task.
 */
function checkInput(parameter, index) {
  const elements = getInputElements(parameter, index);
  updateInputImages(elements.inputField, elements.emptyInputImg, elements.fullInputImgs);
}


/**
* This function is used to retrieve the necessary input elements based on the parameter and index.
*
* @param {string} parameter - The parameter indicating the type of task.
* @param {number} index - The index of the task.
* @returns {Object} An object containing the input elements.
*/
function getInputElements(parameter, index) {
  if (parameter === "addTask") {
      return {
          inputField: document.getElementById("subtasks-input"),
          emptyInputImg: document.getElementById("subtasks-popup-empty-img"),
          fullInputImgs: document.getElementById("subtasks-popup-full-img")
      };
  } else {
      return {
          inputField: document.getElementById("subtasks-input" + index),
          emptyInputImg: document.getElementById("subtasks-popup-empty-img" + index),
          fullInputImgs: document.getElementById("subtasks-popup-full-img" + index)
      };
  }
}


/**
* This function is used to update the display of input images based on the input field value.
*
* @param {HTMLElement} inputField - The input field element.
* @param {HTMLElement} emptyInputImg - The empty input image element.
* @param {HTMLElement} fullInputImgs - The full input image element.
*/
function updateInputImages(inputField, emptyInputImg, fullInputImgs) {
  if (inputField.value.trim() !== "") {
      emptyInputImg.classList.add("display-none");
      fullInputImgs.style.display = "flex";
  } else {
      emptyInputImg.classList.remove("display-none");
      fullInputImgs.style.display = "none";
  }
}


/**
* This function is used to set the priority of the task.
*
* @param {string} prio - The priority of the task.
*/
function getPrio(prio) {
  resetPrioButtons();
  updatePrioButton(prio);
}


/**
* This function is used to reset the priority buttons to their default state.
*/
function resetPrioButtons() {
  const BUTTON_URGENT = document.getElementById("button-urgent");
  const BUTTON_MEDIUM = document.getElementById("button-medium");
  const BUTTON_LOW = document.getElementById("button-low");
  const IMG_URGENT = document.getElementById("img-urgent");
  const IMG_MEDIUM = document.getElementById("img-medium");
  const IMG_LOW = document.getElementById("img-low");

  BUTTON_URGENT.classList.remove("button-urgent-active");
  BUTTON_MEDIUM.classList.remove("button-medium-active");
  BUTTON_LOW.classList.remove("button-low-active");
  IMG_URGENT.src = "/assets/img/urgent.svg";
  IMG_MEDIUM.src = "/assets/img/medium.svg";
  IMG_LOW.src = "/assets/img/low.svg";
}


/**
* This function is used to update the priority button based on the selected priority.
*
* @param {string} prio - The selected priority.
*/
function updatePrioButton(prio) {
  if (prio === "Low") {
      setPrioLow();
  } else if (prio === "Medium") {
      setPrioMedium();
  } else if (prio === "Urgent") {
      setPrioUrgent();
  }
}


/**
* This function is used to set the priority to Low and updates the corresponding button and image.
*/
function setPrioLow() {
  currentPrio = "Low";
  const BUTTON_LOW = document.getElementById("button-low");
  const IMG_LOW = document.getElementById("img-low");

  BUTTON_LOW.classList.add("button-low-active");
  IMG_LOW.src = "/assets/img/prio_low_white.svg";
}


/**
* This function is used to set the priority to Medium and updates the corresponding button and image.
*/
function setPrioMedium() {
  currentPrio = "Medium";
  const BUTTON_MEDIUM = document.getElementById("button-medium");
  const IMG_MEDIUM = document.getElementById("img-medium");

  BUTTON_MEDIUM.classList.add("button-medium-active");
  IMG_MEDIUM.src = "/assets/img/prio_medium_white.svg";
}


/**
* This function is used to set the priority to Urgent and updates the corresponding button and image.
*/
function setPrioUrgent() {
  currentPrio = "Urgent";
  const BUTTON_URGENT = document.getElementById("button-urgent");
  const IMG_URGENT = document.getElementById("img-urgent");

  BUTTON_URGENT.classList.add("button-urgent-active");
  IMG_URGENT.src = "/assets/img/prio_urgent_white.svg";
}