/**
 * Sets up the event listeners for the document and the contacts list.
 */
function setupEventListeners() {
  let pathname = window.location.pathname;
  if (pathname.includes("addTask.html") || pathname.includes("board.html")) {
  document.addEventListener("click", handleDocumentClick);
  document.getElementById("contacts-list").addEventListener("click", assignContactToTask);
  }
}


/**
 * Handles clicking on the document to hide the contacts list
 * if the click occurs outside of the contacts list.
 *
 * @param {Event} event - The event object that triggers clicking on the document.
 */
function handleDocumentClick(event) {
  let taskContainer = document.getElementById("task-container");
  if (!taskContainer.contains(event.target)) {
    hideContactsToAssign();
  }
}


/**
 * Toggles the visibility of the contacts list.
 *
 * @param {Event} event - The event object that triggers toggling the contacts list.
 */
function toggleContactsToAssign(event) {
  event.stopPropagation(); 
  let contactAssignList = document.getElementById("contacts-list");
  if (contactAssignList.classList.contains("hidden")) {
    showContactsToAssign(event);
  } else {
    hideContactsToAssign();
  }
}


/**
 * Shows the contacts list.
 *
 * @param {Event} event - The event object that triggers showing the contacts list.
 */
function showContactsToAssign(event) {
  event.stopPropagation(); 
  let contactAssignList = document.getElementById("contacts-list");
  let arrow = document.getElementById("drop-down-arrow");

  contactAssignList.classList.remove("hidden");
  arrow.src = "/assets/img/arrow_drop_down (1).svg";

  renderContactList(filteredContactsList);
}

/**
 * This function is used to hide the contacts list for task assignment and updates the dropdown arrow image.
 */
function hideContactsToAssign() {
  let contactAssignList = document.getElementById("contacts-list");
  let arrow = document.getElementById("drop-down-arrow");

  contactAssignList.classList.add("hidden");
  arrow.src = "/assets/img/arrow_drop_down.svg";
}


/**
 * Searches contacts based on the input value.
 */
function searchContact() {
  let search = document.getElementById("input-assignTo").value;
  if (search.length >= 3) {
    filteredContactsList = assignedContactsList.filter((contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    filteredContactsList = assignedContactsList;
  }
  renderContactList(filteredContactsList);
}


/**
 * Renders the list of contacts based on the filter.
 * @param {Array<object>} filteredContactsList - The filtered list of contacts.
 */
function renderContactList(filteredContactsList) {
  let contactListContainer = document.getElementById("contacts-list");
  if (contactListContainer.classList.contains("contacts-list")) {
    contactListContainer.innerHTML = "";

    for (let i = 0; i < filteredContactsList.length; i++) {
      const ASSIGN_CONTACT = filteredContactsList[i];
      let id = ASSIGN_CONTACT.id;
      let color = ASSIGN_CONTACT.color;
      let { initials, name } = extractInitialsAndName(ASSIGN_CONTACT);
      contactListContainer.innerHTML += contactListTemplate(initials, name, color, i, id);
    }
  } else {
    contactListContainer.innerHTML = "";
  }
}


/**
 * This function is used to assign a contact to the task.
 * 
 * @param {number} i - The index of the contact.
 * @param {Event} event - The event object.
 */
function assignContactToTask(i, event) {
  event.stopPropagation();
  toggleContactStyle(i);
  updateContactCheckImages(i);
  updateContactList(i);
  renderSelectedContacts();
  renderContactList(assignedContactsList);
}


/**
* This function is used to toggle the visual selection state of a contact.
*
* @param {number} i - The index of the contact.
*/
function toggleContactStyle(i) {
  let assignContactContainer = document.getElementById(`assigntContact${i}`);
  assignContactContainer.style.backgroundColor =
      assignContactContainer.style.backgroundColor === "var(--customized_darkblue)" 
      ? "" 
      : "var(--customized_darkblue)";
  assignContactContainer.style.color =
      assignContactContainer.style.color === "white" ? "" : "white";
}


/**
* This function is used to update the display state of the check images for a contact.
*
* @param {number} i - The index of the contact.
*/
function updateContactCheckImages(i) {
  let imgCheckOff = document.getElementById(`img_check_off${i}`);
  let imgCheckOn = document.getElementById(`img_check_on${i}`);

  if (imgCheckOff.style.display === "none") {
      imgCheckOff.style.display = "block";
      imgCheckOn.style.display = "none";
  } else {
      imgCheckOff.style.display = "none";
      imgCheckOn.style.display = "block";
  }
}


/**
* This function is used to update the contact array based on the selection state.
*
* @param {number} i - The index of the contact.
*/
function updateContactList(i) {
  let imgCheckOff = document.getElementById(`img_check_off${i}`);

  if (imgCheckOff.style.display === "block") {
      removeContactInArray(assignedContactsList[i]);
  } else {
      pushContactInArray(assignedContactsList[i]);
  }
}


/**
 * This function is used to check if a contact is already assigned to the task.
 * 
 * @param {number} index - The index of the contact.
 * @returns {boolean} True if the contact is already assigned, false otherwise.
 */
function checkMatchContact(index) {
  for (let i = 0; i < assignedContacts.length; i++) {
    const ASSIGNED_CONTACT = assignedContacts[i];

    if (ASSIGNED_CONTACT == assignedContactsList[index]) {
      return true;
    }
  }
  return false;
}


/**
 * This function is used to remove a contact from the assigned contacts array.
 * 
 * @param {string} name - The name of the contact to remove.
 */
function removeContactInArray(name) {
  let index = assignedContacts.findIndex((n) => n == name);
  assignedContacts.splice(index, 1);
}


/**
 * This function is used to add a contact to the assigned contacts array.
 * 
 * @param {string} name - The name of the contact to add.
 */

function pushContactInArray(name) {
  assignedContacts.push(name);
}


/**
 * Renders the selected contacts.
 */
function renderSelectedContacts() {
  let selectedContactsContainer = document.getElementById("selected-contacts");
  selectedContactsContainer.innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    const contact = assignedContacts[i];
    let { initials } = extractInitialsAndName(contact);
    let color = contact.color;
    selectedContactsContainer.innerHTML += renderInitialsIcon(initials, color);
  }
}
