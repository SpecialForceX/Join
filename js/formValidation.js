let formActiv = false;

/**
 * Initiates the start page sequence by loading necessary data.
 * 
 * This function asynchronously loads the login data and contacts data.
 * 
 * @async
 * @function startPage
 * @returns {Promise<void>} A promise that resolves once all data is loaded.
 */
async function startPage() {
    await loadAllData('loginData');
    await loadAllData('contacts');
}


/**
 * Initiates form validation on form submission.
 *
 * This function prevents the form submission if validation is already active.
 * If not, it sets the validation active flag to true and proceeds to validate the form.
 *
 * @function startFormValidation
 * @param {Event} event - The event object associated with the form submission.
 */
function startFormValidation(event) {
    if (formActiv) {
        event.preventDefault();
    } else {
        formActiv = true;
        validationCheck(event);
    }
}


/**
 * Enables or disables the submit button based on the checkbox state.
 *
 * This function checks the state of the event target (assumed to be a checkbox)
 * and enables or disables the button(s) within the same form.
 *
 * @param {Event} event - The event object from the checkbox click.
 */
function enabledButton(event) {
    let element = event.target;
    let button = element.closest('form').querySelectorAll('button');
    activatButton(button, element.checked);
}


/**
 * Activates or deactivates a list of buttons based on the provided status.
 *
 * This function iterates through an array of button elements and sets their
 * 'disabled' attribute based on the boolean status provided.
 *
 * @param {NodeList} buttons - A list of button elements to be activated or deactivated.
 * @param {boolean} status - The status to determine if buttons should be enabled (true) or disabled (false).
 */
function activatButton(buttons, status) {
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        if (status) {
            button.removeAttribute('disabled');
        } else {
            button.setAttribute('disabled', 'true');
        }
    }
}


/**
 * Checks the validity of input fields within a form and activates or deactivates buttons accordingly.
 *
 * This function is triggered by an event, typically a click event on a button. It finds all buttons and 
 * input fields (excluding checkboxes) within the form containing the event target. It deactivates all buttons,
 * checks the validity of the input fields, and then activates or deactivates the buttons based on the validity.
 * Finally, it dispatches a submit event on the form.
 *
 * @param {Event} event - The event object associated with the triggering event.
 */
function validationCheck(event) {
    let input = event.target.closest('form').querySelectorAll('input:not([type="checkbox"])');
    let check = validityCheck(input);
    if (!check) {
        formActiv = false;
    }
}


/**
 * Checks the validity of a list of input elements and applies a red border to invalid elements.
 *
 * This function iterates over an array of input elements, checks each element for validity,
 * and applies a red border to any invalid elements. It returns a boolean indicating whether
 * all elements are valid.
 *
 * @param {HTMLElement[]} elements - An array of input elements to be checked for validity.
 * @returns {boolean} - Returns true if all input elements are valid, false otherwise.
 */
function validityCheck(elements) {
    let allCheck = true;
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        allCheck = allCheck & checkErrorHighlight(element);
    }
    return allCheck;
}


/**
 * Checks and highlights errors for a given form element.
 *
 * This function detects the type of error for the form element, selects the appropriate
 * error message, and sets the error highlight. It returns a boolean indicating whether
 * the element has no errors.
 *
 * @function checkErrorHighlight
 * @param {HTMLInputElement} element - The form element to check and highlight errors for.
 * @returns {boolean} - Returns true if there are no errors ('none'), false otherwise.
 */
function checkErrorHighlight(element) {
    let type = detctErrorType(element);
    let errorMsg = selectErrorMsg(type);
    setErrorHighlight(element, errorMsg);
    if (type == 'none') {
        return true;
    } else {
        return false;
    }
}


/**
 * Detects the type of error for a given form element.
 *
 * This function checks if the form element's value is empty, if it is valid
 * according to the browser's built-in validation, and returns a corresponding
 * error type string.
 *
 * @function detctErrorType
 * @param {HTMLInputElement} element - The form element to check for errors.
 * @returns {string} - The type of error detected ('empty', the element's type, or 'none').
 */
function detctErrorType(element) {
    let empty = element.value.trim() === '';
    let valid = element.checkValidity();
    let type = element.type;
    if (empty) {
        return 'empty';
    } else if (!valid) {
        return type;
    } else {
        return 'none'
    }
}


/**
 * Selects an error message based on the provided error type.
 *
 * This function returns an appropriate error message string based on the given error type.
 *
 * @function selectErrorMsg
 * @param {string} errorType - The type of error to get the message for.
 * @returns {string} - The corresponding error message string.
 */
function selectErrorMsg(errorType) {
    switch (errorType) {
        case 'empty':
            return 'This field is required';
        case 'email':
            return 'You must enter a valid Emailadress';
        case 'password':
            return 'Wrong password Ups! Try again.';
        case 'none':
            return 'noError';
        case 'match':
            return 'Ups! your password don`t match';
        case 'user':
            return 'User don`t exist'
    }
}


/**
 * Sets or removes error highlights and messages on input elements.
 *
 * This function adds or removes the 'errorBorder' class to the parent element of the input field
 * and displays or hides an error message based on the provided error message.
 *
 * @function setErrorHighlight
 * @param {HTMLElement} element - The input element that requires error highlighting.
 * @param {string} errorMsg - The error message to display. If 'noError', error highlights are removed.
 */
function setErrorHighlight(element, errorMsg) {
    let borderDiv = element.parentElement;
    let textDiv = element.parentElement.parentElement.querySelector('.errorInfo');
    if (errorMsg != 'noError') {
        borderDiv.classList.add('errorBorder');
        textDiv.classList.add('errorVisibility');
        textDiv.innerHTML = errorMsg;
    } else {
        borderDiv.classList.remove('errorBorder');
        textDiv.classList.remove('errorVisibility');
    }
}


/**
 * Validates the password and logs the user in.
 *
 * This function is triggered when the form is submitted. It prevents the default form submission
 * behavior and then proceeds to validate the password entered by the user. It encrypts the input
 * data, checks if the user exists in the login data, and logs the user in if the password is valid.
 * Additionally, it handles the "Remember Me" functionality.
 *
 * @param {Event} event - The submit event triggered by the form submission.
 * @returns {Promise<void>} - A Promise that resolves when the user is logged in.
 */
async function passwordValidation(event) {
    event.preventDefault();
    let form = event.target;
    let userData = await encryptIput(form);
    let user = await validateLogin(userData);
    formActiv = user ? true : false;
    let rememberMe = form.querySelector('input[type="checkbox"]');
    ermenmberMe(user, rememberMe.checked);
    loginAsUser(user);
}


/**
 * Handles the "Remember Me" functionality.
 *
 * If the "Remember Me" checkbox is checked and a user ID is provided, it saves the user ID locally.
 * If the checkbox is unchecked or no user ID is provided, it deletes the locally saved user ID.
 *
 * @param {string|null} id - The ID of the user to be remembered.
 * @param {boolean} checked - Indicates whether the "Remember Me" checkbox is checked.
 * @returns {void} - This function does not return a value.
 */
function ermenmberMe(id, checked) {
    if (id && checked) {
        saveLocal('saveuser', id);
    } else {
        deleteLocal('saveuser');
    }
}


/**
 * Encrypts the user input from the login form.
 *
 * @param {HTMLFormElement} form - The login form element.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the encrypted user data.
 */
async function encryptIput(form) {
    let user = form.elements['email'];
    let passwordElement = form.elements['password'];
    let password = await encrypt(form.elements['password'].value);
    let logindata = {
        "userElement": user,
        "email": user.value,
        "passwordElement": passwordElement,
        "password": password
    }
    return logindata;
}


/**
 * Validates user login by checking email and password against stored login data.
 *
 * This function retrieves login data, finds a user by email, and checks if the provided password matches
 * the stored password. It sets error highlights for email and password fields based on validation results.
 *
 * @async
 * @function validateLogin
 * @param {Object} userData - The user data object containing email and password information.
 * @param {HTMLInputElement} userData.userElement - The input element for the user's email.
 * @param {string} userData.email - The email address provided by the user.
 * @param {HTMLInputElement} userData.passwordElement - The input element for the user's password.
 * @param {string} userData.password - The password provided by the user.
 * @returns {Promise<number|boolean>} - A promise that resolves to the user ID if login is successful, otherwise false.
 */
async function validateLogin(userData) {
    let logindata = await getLoginDataArray();
    let userIndex = logindata.findIndex(function (login) { return login.email === userData.email });
    let userFound = userIndex != -1;
    let passwordMatch = false;
    setErrorHighlight(userData.userElement, selectErrorMsg(userFound ? 'none' : 'user'));
    if (userFound) {
        passwordMatch = logindata[userIndex].password == userData.password;
        setErrorHighlight(userData.passwordElement, selectErrorMsg(passwordMatch ? 'none' : 'password'));
    }
    let result = userFound && passwordMatch ? logindata[userIndex].id : false;
    return result;
}


/**
 * Handles the user sign-up process.
 *
 * @param {Event} event - The form submit event.
 * @returns {Promise<void>} - A promise that resolves when the sign-up process is complete.
 */
async function signUpUser(event) {
    event.preventDefault();
    let form = event.target;
    let check = confirmPassword(form);
    if (check) {
        await saveUserData(form);
        showSuccess();
    } else {
        formActiv = false;
    }
}


/**
 * Validates that the password and confirm password fields match.
 *
 * @param {HTMLFormElement} form - The form containing the password fields.
 * @returns {boolean} - Returns true if the passwords match, otherwise false.
 */
function confirmPassword(form) {
    let firstPassword = form.elements['password'];
    let secondPassword = form.elements['confirmPassword'];
    if (firstPassword.value == secondPassword.value) {
        setErrorHighlight(secondPassword, selectErrorMsg('none'));
        return true;
    } else {
        setErrorHighlight(secondPassword, selectErrorMsg('match'));
        return false
    }
}


/**
 * Saves the user data by encrypting the password, creating user and contact objects,
 * and then adding them to the login and contacts data stores.
 *
 * @param {HTMLFormElement} form - The form containing the user input fields.
 * @returns {Promise<void>} - A promise that resolves when the user data has been saved.
 */
async function saveUserData(form) {
    let name = form.elements['name'].value;
    let email = form.elements['email'].value;
    let password = await encrypt(form.elements['password'].value);
    let userData = creatUser(name, password, email);
    await addLoginData(userData);
    let contactData = creatContact(name, email, 'no Number', 'C3FF2B');
    await addContacts(contactData);
}


/**
 * Displays a success message by showing a background and sliding in a banner.
 * After a delay, it redirects the user to the login page.
 */
function showSuccess() {
    document.getElementById('successBackground').classList.add('show');
    document.getElementById('successBanner').classList.add('slide');
    setTimeout(function () { window.location.href = '../html/login.html'; }, 1500);
}


/**
 * Logs in as a guest user.
 * 
 * @param {Event} event - The event object representing the form submission.
 */
function loginAsGuest(event) {
    event.preventDefault();
    saveLocal('activUser', 'guest');
    window.location.href = '../html/summary.html';
}


/**
 * Logs in a user by their ID.
 * 
 * @param {number|string} id - The ID of the user to log in.
 */
function loginAsUser(id) {
    if (id) {
        saveLocal('activUser', id);
        window.location.href = '../html/summary.html';
    }
}