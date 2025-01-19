window.onload = init();
// window.addEventListener('orientationchange', rotatbody);


/**
 * Initializes the application by checking login status and redirecting if necessary.
 */
function init() {
    savedLogin();
    loginCheck();
}


/**
 * Checks if the user is logged in and saves the login status.
 * If the current page is the login page, it checks if a user is saved locally.
 * If not, it saves the active user status as false; otherwise, it saves the saved user's status.
 * Finally, it checks if the user is still logged in.
 */
function savedLogin() {
    if (window.location.pathname.includes("login.html")) {
        let savedUser = loadLocal('saveuser');
        if (!savedUser) {
            saveLocal('activUser', false);
        } else {
            saveLocal('activUser', savedUser);
        }
        stillLogedIn()
    }
}


/**
 * Redirects the user to the summary page if they are still logged in.
 * Retrieves the active user status from local storage.
 * If the user status is not 'false', it redirects the user to the summary page.
 */
function stillLogedIn() {
    let user = loadLocal('activUser');
    if (user != 'false') {
        window.location.href = '../html/summary.html';
    }
}


/**
 * Checks if the user is logged in.
 * Redirects to the login page if the user is not logged in and the current page is not the login or signup page.
 */
function loginCheck() {
    let onLoginPage = window.location.pathname.includes("login.html");
    let onSignupPage = window.location.pathname.includes("signup.html");
    let userIs = loadLocal('activUser');
    if (!onLoginPage && !onSignupPage) {
        if (userIs == 'false' || !userIs) {
            window.location.href = '../html/login.html'
        }
    }
}


/**
 * Rotates the body of the webpage based on the device orientation.
 * Adds the 'rotat90' class to the body if the device orientation is landscape, 
 * otherwise removes the 'rotat90' class.
 */
function rotatbody() {
    if (window.navigator.userAgentData.mobile) {
        if (screen.orientation.type.includes('portrait')) {
            document.querySelector('body').classList.remove('rotat90');
        } else {
            document.querySelector('body').classList.add('rotat90');
        }
    }
}

