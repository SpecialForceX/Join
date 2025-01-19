/**
 * Initiates the start page sequence.
 * 
 * This function triggers two actions with delays:
 * 1. After 700 milliseconds, the `slideLogo` function is called to animate the logo.
 * 2. After 1500 milliseconds, the `switchToLogin` function is called to redirect the user to the login page.
 */
function startPage() {

    setTimeout(slideLogo, 700);
    setTimeout(switchToLogin, 1500);
}


/**
 * Adjusts the logo display and behavior based on the window width.
 * - Shrinks and slides the logo.
 * - Changes the visibility of dark and light logos.
 * - Adds a background class to the parent element of the logo if the window width is less than or equal to 1055 pixels.
 */
function slideLogo() {
    let width = window.innerWidth;
    let logo = document.getElementById('content');
    let imgDark = document.getElementById('logoDark');
    let imgLight = document.getElementById('logoLight');
    logo.classList.add('shrink_n_slide');
    if (width <= 1055) {
        imgDark.classList.add('show');
        imgLight.classList.add('hide');
        logo.parentElement.classList.add('background');
    }
}


/**
 * Redirects the user to the login page.
 * 
 * This function changes the current window location to the login page located at '../html/login.html'.
 */
function switchToLogin() {
    window.location.href = '../html/login.html';
}
