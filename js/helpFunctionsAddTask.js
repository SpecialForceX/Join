/**
 * Adds a focused class to the specified element.
 * @param {HTMLElement} element - The HTML element to which the focused class will be added.
 */
function setFocusedBorder(element) {
  element.classList.add("focused");
}

/**
 * Adds an error class to the specified element.
 * @param {HTMLElement} element - The HTML element to which the error class will be added.
 */
function setErrorBorder(elements) {
  elements.classList.add("error");
}

/**
 * Removes the error class from the specified element.
 * @param {HTMLElement} element - The HTML element from which the error class will be removed.
 */
function removeErrorBorder(elements) {
  elements.classList.remove("error");
}

/**
 * Validates the input fields for a task and displays error messages if validation fails.
 */
function testTask() {
  const titleInput = document.getElementById("input-title");
  const dateInput = document.getElementById("input-date");
  const categoryInput = document.getElementById("input-category");

  let isTitleValid = titleInput.value.trim() !== "";
  let isDateValid = dateInput.value.trim() !== "";
  let isCategoryValid = categoryInput.value.trim() !== "";
  checkInputValidation(isTitleValid, isDateValid, isCategoryValid, titleInput, dateInput, categoryInput);
}

/**
 * Checks the validation of input fields and displays or hides error messages accordingly.
 * @param {boolean} isTitleValid - Indicates if the title input is valid.
 * @param {boolean} isDateValid - Indicates if the date input is valid.
 * @param {boolean} isCategoryValid - Indicates if the category input is valid.
 * @param {HTMLElement} titleInput - The title input HTML element.
 * @param {HTMLElement} dateInput - The date input HTML element.
 * @param {HTMLElement} categoryInput - The category input HTML element.
 */
function checkInputValidation(isTitleValid, isDateValid, isCategoryValid, titleInput, dateInput, categoryInput) {
  validateInput(isTitleValid, titleInput, "title-error");
  validateInput(isDateValid, dateInput, "date-error");
  validateInput(isCategoryValid, categoryInput, "category-error");
}

/**
 * Displays or hides the error message for a specific input based on its validation status.
 * @param {boolean} isValid - Indicates if the input is valid.
 * @param {HTMLElement} inputElement - The input HTML element to be validated.
 * @param {string} errorElementId - The ID of the HTML element that displays the error message.
 */
function validateInput(isValid, inputElement, errorElementId) {
  let errorElement = document.getElementById(errorElementId);
  let errorText = errorElement.querySelector(".error-text");

  if (!isValid) {
    setErrorBorder(inputElement.parentElement);
    errorText.style.display = "block";
  } else {
    removeErrorBorder(inputElement.parentElement);
    errorText.style.display = "none";
  }
}

/**
 * Sets event listeners on input fields to add or remove a focused class on focus and blur events.
 */
function setEventlister() {
  let inputLeft = document.getElementById("title-container").parentElement.querySelectorAll(".add-task-input-container");
  let inputRight = document.getElementById("date-container").parentElement.querySelectorAll(".add-task-input-container");
  let inputs = [inputLeft, inputRight];
  for (let j = 0; j < inputs.length; j++) {
    const nodeList = inputs[j];
    for (let i = 0; i < nodeList.length; i++) {
      const element = nodeList[i].children[0];
      element.addEventListener("focus", (event) => {
        setBorder(event);
      });
      element.addEventListener("blur", (event) => {
        unsetBorder(event);
      });
    }
  }
}

/**
 * Adds a focused class to the parent element of the event target.
 * @param {Event} event - The event object.
 */
function setBorder(event) {
  let target = event.target;
  target.parentElement.classList.add("focused");
}

/**
 * Removes the focused class from the parent element of the event target.
 * @param {Event} event - The event object.
 */
function unsetBorder(event) {
  let target = event.target;
  target.parentElement.classList.remove("focused");
}


/**
 * Sets the minimum date for the date input field to today's date.
 * This ensures that users cannot select a date in the past.
 */
function initializeDateInput() {
  let today = new Date().toISOString().split('T')[0];
  document.getElementById('input-date').setAttribute('min', today);
}
