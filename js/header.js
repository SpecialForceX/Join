let logedUserDataArray = [];
let logedUser = [];


/**
 * This function is used to toggle the visibility of the profile sidebar.
 */
function showProfileSidebar() {
    let sidebar = document.getElementById('profileSidebar');
        if (sidebar.style.display === 'none' || sidebar.style.display === '') {
            sidebar.style.display = 'block';
        } else {
            sidebar.style.display = 'none';
        }
}


/**
 * This function is used to set the profile initials of the logged user.
 */
async function getProfileInitials() {
    await loadLoginData();
    logedUser = loadLocal('activUser');
    let container = document.getElementById('profile-initials');
    let userIndex = logedUserDataArray.findIndex(u => u.id == logedUser);
    let user = logedUserDataArray[userIndex];

    if (userIndex >= 0) {
        let { name } = extractInitialsAndName(user);
        let words = name.split(" ");
        let initials = words.map(word => word[0]).join("");
        container.innerHTML = initials;
    } else {
        container.innerHTML = 'G';
    }
}


/**
 * This function is used to load login Data
 */
async function loadLoginData() {
    logedUserDataArray = await getLoginDataArray();
}


/**
 * Extracts the initials and formatted name from a contact.
 * @param {Object} contact - The contact object.
 * @returns {Object} An object containing the initials and formatted name.
 */
function extractInitialsAndName(contact) {
    let names = contact.name.split(" ");
    let initials = "";
    let name = "";
  
    if (names.length > 1) {
      initials = names.map((word) => word.charAt(0).toUpperCase()).join("");
      name = names
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      initials = contact.name.charAt(0).toUpperCase();
      name = contact.name.charAt(0).toUpperCase() + contact.name.slice(1);
    }
    return { initials, name };
  }