let previousContactIndex = null;
let realPreviousContactIndex = "";
let contactList = [];
let contactListUnsorted = [];


/**
 * Initializes the application by loading all data and contacts.
 */
async function init() {
  await initInclude();
  await loadAllData();
  contactList = await getContactsArray();
  loadContacts();
  getProfileInitials();
}


/**
 * Loads and displays contacts.
 */
async function loadContacts() {
  contactList = await getContactsArray();
  contactListUnsorted = await getContactsArray();
  sortContacts();
  let allContacts = document.getElementById("all-contacts");
  allContacts.innerHTML = "";
  let previousInitial = "";
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i];
    const initial = contact.name.charAt(0).toUpperCase();

    if (initial !== previousInitial) {
      allContacts.innerHTML += renderInitial(initial);
      previousInitial = initial;
    }
    allContacts.innerHTML += renderContacts(contact, i);
  }
}


/**
 * Sorts the contacts alphabetically by name.
 */
function sortContacts() {
  contactList.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
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


/**
 * Renders the floating contact details.
 * @param {Object} contact - The contact object.
 */
function renderFloatingContact(contact) {
  let { initials, name } = extractInitialsAndName(contact);

  document.getElementById("card-tel").innerHTML = contact.phone;
  document.getElementById("card-email").innerHTML = contact.email;
  document.getElementById("card-name").innerHTML = name;
  document.getElementById("card-initial").innerHTML = initials;
  let iconColor = document.getElementById("card-icon-color");
  iconColor.style.backgroundColor = "#" + contact.color;

  renderEditContact(contact);
}


/**
 * Renders the contact details in the edit form.
 * @param {Object} contact - The contact object.
 */
function renderEditContact(contact) {
  let { initials } = extractInitialsAndName(contact);

  document.getElementById("edit-initial").innerHTML = initials;
  document.getElementById("edit-contact-name").value = contact.name;
  document.getElementById("edit-contact-email").value = contact.email;
  document.getElementById("edit-contact-tel").value = contact.phone;
  document.getElementById("profile-color").style.backgroundColor =
    "#" + contact.color;
}


/**
 * Shows or hides the edit contact form.
 * @param {string} parameter - 'show' to display the form, 'hide' to hide it.
 */
function showEditContact(parameter) {
  let contactIndex = previousContactIndex;
  let contact = contactList[contactIndex];
  let editCard = document.getElementById("edit-card");
  if (parameter == "show") {
    editCard.classList.remove("remove-contact-container");
  } else if (parameter == "hide") {
    editCard.classList.add("remove-contact-container");
    clearErrors();
  }
  renderEditContact(contact);
}


/**
 * Edits the contact details.
 */
async function editContact() {
  let contactIndex = previousContactIndex;
  let realIndex = contactListUnsorted.findIndex(
    (contact) => contact.id === contactList[previousContactIndex].id
  );
  let changeContact = await getContacts(realIndex);

  changeContact.name = document.getElementById("edit-contact-name").value;
  changeContact.email = document.getElementById("edit-contact-email").value;
  changeContact.phone = document.getElementById("edit-contact-tel").value;

  let contact = `contact${contactIndex}`;
  await editContacts(realIndex, changeContact);
  showEditContact("hide");
  showContact(contactIndex);
  await loadContacts();
  renderFloatingContact(contactList[contactIndex]);
  simulateClickButton(contact);
}


/**
 * Adds a new contact.
 */
async function AddContact() {
  let button =   document.getElementById("add-contact-button");
  button.disabled = true;

  let name = document.getElementById("contact-name").value;
  let email = document.getElementById("contact-email").value;
  let tel = document.getElementById("contact-tel").value;

  let color = generateProfileColor();

  let newContact = creatContact(name, email, tel, color);
  await addContacts(newContact);
  AddContactToContacts(newContact);

  button.disabled = false;
}


/**
 * Adds the new contact to the contact list and displays it.
 * @param {Object} newContact - The new contact object.
 */
async function AddContactToContacts(newContact) {
  document.getElementById("contact-name").value = "";
  document.getElementById("contact-email").value = "";
  document.getElementById("contact-tel").value = "";

  await loadContacts();
  showAddContact();
  contactCreatedMessage();
  let newIndex = contactList.findIndex(
    (contact) => contact.id === newContact.id
  );
  scrollToAddedContact(newIndex);
  showContact(newIndex);
}


/**
 * Displays a message indicating that the contact was created.
 */
function contactCreatedMessage() {
  let createdContact = document.getElementById("created-contact");
  createdContact.classList.remove("remove-contact-message");
  setTimeout(contactCreatedHideMessage, 2000);
}


/**
 * Hides the contact created message.
 */
function contactCreatedHideMessage() {
  let createdContact = document.getElementById("created-contact");
  createdContact.classList.add("remove-contact-message");
}


/**
 * Scrolls to the newly added contact in the contact list.
 * @param {number} newIndex - The index of the new contact.
 */
function scrollToAddedContact(newIndex) {
  let newContactElement = document.getElementById(`contact${newIndex}`);
  newContactElement.scrollIntoView({ behavior: "smooth", block: "center" });
}


/**
 * Shows or hides the add contact form.
 * @param {string} parameter - 'show' to display the form, 'hide' to hide it.
 */
function showAddContact(parameter) {
  let contactCard = document.getElementById("contact-card");
  if (parameter == "show") {
    contactCard.classList.remove("remove-contact-container");
  } else {
    contactCard.classList.add("remove-contact-container");
    clearErrors();
  }
}


/**
 * Prevents the event from propagating.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
  event.stopPropagation();
}


/**
 * Displays the contact details.
 * @param {number} i - The index of the contact to show.
 */
function showContact(i) {
  let menu = document.getElementById("contact-detail-data");
  let contact = document.getElementById(`contact${i}`);

  if (previousContactIndex === i) {
      toggleContactSelection(contact, menu);
  } else {
      highlightNewContact(contact, menu, i);
      previousContactIndex = i;
      renderFloatingContact(contactList[i]);
  }
}


/**
* Toggles the visual selection state of the contact and the menu.
* @param {HTMLElement} contact - The contact element.
* @param {HTMLElement} menu - The menu element.
*/
function toggleContactSelection(contact, menu) {
  contact.style.backgroundColor =
      contact.style.backgroundColor === "var(--customized_darkblue)" ? "" : "var(--customized_darkblue)";
  contact.style.color = contact.style.color === "white" ? "" : "white";
  menu.classList.toggle("remove-contact-detail");
}


/**
* Highlights the new contact and resets the previous contact's style.
* @param {HTMLElement} contact - The new contact element.
* @param {HTMLElement} menu - The menu element.
* @param {number} i - The index of the new contact.
*/
function highlightNewContact(contact, menu, i) {
  contact.style.backgroundColor = "var(--customized_darkblue)";
  contact.style.color = "white";
  resetPreviousContactStyle();
  menu.classList.remove("remove-contact-detail");
}


/**
* Resets the style of the previously selected contact.
*/
function resetPreviousContactStyle() {
  if (previousContactIndex !== null) {
      let previousContact = document.getElementById(`contact${previousContactIndex}`);
      if (previousContact) {
          previousContact.style.backgroundColor = "";
          previousContact.style.color = "";
      }
  }
}


/**
 * Deletes the currently selected contact.
 */
async function deleteCurrentContact() {
  let realIndex = contactListUnsorted.findIndex(
    (contact) => contact.id === contactList[previousContactIndex].id
  );
  let contactNameId = contactListUnsorted[realIndex].id;
  await deleteContact(previousContactIndex, realIndex);
  deleteContactsFromTasks(contactNameId);
}


/**
 * Removes the contact from tasks and updates the tasks.
 * @param {string} contactName - The name of the contact to remove.
 */
async function deleteContactsFromTasks(contactNameId) {
  await getAllTasks();
  let updatedTasks = sortMatchingNames(contactNameId);
  for (let i = 0; i < updatedTasks.length; i++) {
    const newTask = updatedTasks[i];
    let indexOfCurTask = allTasks.findIndex((t) => t.id == newTask.id);

    let newUpdatedTask = creatTask(newTask["asigntTo"], newTask["category"], newTask["date"], newTask["description"], newTask["prio"],newTask["status"], newTask["subTasks"], newTask["title"]);
    await editTasks(indexOfCurTask, newUpdatedTask);
  }
}


/**
 * Filters tasks that match the contact name and removes the contact from the task assignments.
 * @param {string} contactName - The name of the contact to remove.
 * @returns {Array} The updated tasks.
 */
function sortMatchingNames(contactNameId) {
  let filtered = [];
  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    for (let j = 0; j < task.asigntTo.length; j++) {
      const element = task.asigntTo[j];
      if (element == contactNameId) {
        allTasks[i].asigntTo.splice(j, 1);
        filtered.push(allTasks[i]);
      }
    }
  }
  return filtered;
}


/**
 * Deletes the contact from the list and updates the UI.
 * @param {number} i - The index of the contact in the sorted list.
 * @param {number} realIndex - The index of the contact in the unsorted list.
 */
async function deleteContact(i, realIndex) {
  previousContactIndex = null;
  let menu = document.getElementById("contact-detail-data");
  let contact = document.getElementById(`contact${i}`);
  let editCard = document.getElementById("edit-card");

  contact.style.backgroundColor = "";
  contact.style.color = "";
  menu.classList.add("remove-contact-detail");
  editCard.classList.add("remove-contact-container");

  await deleteContacts(realIndex);
  await loadContacts();
}


/**
 * Generates a random profile color.
 * @returns {string} The hex color code.
 */
function generateProfileColor() {
  let color = [
    "ff7a00",
    "9327ff",
    "6e52ff",
    "fc71ff",
    "ffbb2b",
    "1fd7c1",
    "462f8a",
    "ff4646",
    "00bee8",
  ];
  let randomColor = color[Math.floor(Math.random() * color.length)];
  return randomColor;
}


/**
 * Removes the floating contact details.
 */
function removeDetailContact() {
  let menu = document.getElementById("contact-detail-data");
  menu.classList.add("remove-contact-detail");
}


/**
 * Opens the menu for editing and deleting contacts.
 * Adds an event listener to hide the menu when clicked outside of the menu.
 */
function showEditAndDeleteContact() {
  let menu = document.getElementById("edit-delete-buttons");
  menu.classList.add('remove-edit-delete-buttons');

  document.addEventListener('click', function(event) {
    let button = document.querySelector('.edit-delete-menu');
    
    if (!menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.remove('remove-edit-delete-buttons');
    }
  });
}

