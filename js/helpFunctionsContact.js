/**
 * Adds an error class to the specified element.
 * @param {HTMLElement} elements - The HTML element to which the error class will be added.
 */
function setErrorBorder(elements) {
  elements.classList.add("error");
}


/**
 * Removes the error class from the specified element.
 * @param {HTMLElement} elements - The HTML element from which the error class will be removed.
 */
function removeErrorBorder(elements) {
  elements.classList.remove("error");
}


/**
 * Validates the input fields for adding a contact and displays error messages if validation fails.
 */
function testAddContactsInput() {
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const telInput = document.getElementById("contact-tel");

  let isNameValid = validateTextLenght(nameInput.value, 3, 18);
  let isEmailValid = validateTextLenght(emailInput.value, 5, 25);
  let isTelValid = validateNumberLength(telInput.value, 3, 12);
  checkInputValidation(
    isNameValid,
    isEmailValid,
    isTelValid,
    nameInput,
    emailInput,
    telInput
  );
}


/**
 * Validates the input fields for editing a contact and displays error messages if validation fails.
 */
function testEditContactsInput() {
  const nameInput = document.getElementById("edit-contact-name");
  const emailInput = document.getElementById("edit-contact-email");
  const telInput = document.getElementById("edit-contact-tel");

  let isNameValid = validateTextLenght(nameInput.value, 3, 18);
  let isEmailValid = validateTextLenght(emailInput.value, 5, 25);
  let isTelValid = validateNumberLength(telInput.value, 3, 12);
  checkInputValidation(
    isNameValid,
    isEmailValid,
    isTelValid,
    nameInput,
    emailInput,
    telInput
  );
}


/**
 * Validates if the text length of value is within the speciied range.
 * @param {string} value - The text value to be validated.
 * @param {number} minlength - The minimum length the text should be.
 * @param {number} maxlength - The maximum length the text can be.
 * @returns {boolean} - Returns true if the text length is within the specified range, otherwise false.
 */
function validateTextLenght(value, minlength, maxlength) {
  return value.trim().length >= minlength && value.trim().length <= maxlength;
}


/**
 * Validates if the number length of a value is within the specified range and consists of digits only.
 * @param {string} value - The number value to be validated.
 * @param {number} minlength - The minimum length the number should be.
 * @param {number} maxlength - The maximum length the number can be.
 * @returns {boolean} - Returns true if the number length is within the specified range and consists of digits only, otherwise false.
 */
function validateNumberLength(value, minlength, maxlength) {
  let numValue = value.trim();
  return (numValue.length >= minlength && numValue.length <= maxlength && /^\d{3,12}$/.test(numValue));
}


/**
 * Checks the validation of input fields and displays or hides error messages accordingly.
 * @param {boolean} isNameValid - Indicates if the name input is valid.
 * @param {boolean} isEmailValid - Indicates if the email input is valid.
 * @param {boolean} isTelValid - Indicates if the telephone input is valid.
 * @param {HTMLElement} nameInput - The name input HTML element.
 * @param {HTMLElement} emailInput - The email input HTML element.
 * @param {HTMLElement} telInput - The telephone input HTML element.
 */
function checkInputValidation(
  isNameValid,
  isEmailValid,
  isTelValid,
  nameInput,
  emailInput,
  telInput
) {
  validateInput(isNameValid, nameInput, "name-error");
  validateInput(isEmailValid, emailInput, "email-error");
  validateInput(isTelValid, telInput, "tel-error");
  validateInput(isNameValid, nameInput, "edit-name-error");
  validateInput(isEmailValid, emailInput, "edit-email-error");
  validateInput(isTelValid, telInput, "edit-tel-error");
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
 * Clears all error borders and error messages from the contact card form fields.
 */
function clearErrors() {
 let inputs = document.querySelectorAll("#contact-card input, #edit-card input");
 inputs.forEach(input => {
  removeErrorBorder(input.parentElement);

  let baseId = input.id.replace("contact-", "").replace("edit-contact-", "edit");
  let errorContainerId = baseId + "-error";
  let errorElement = document.getElementById(errorContainerId);
  if (errorElement) {
    let errorText = errorElement.querySelector(".error-text");
    if (errorText) {
      errorText.style.display = "none";
    }
  }
});
}
