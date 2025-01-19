/**
 * Renders the initial letter of the contact names.
 * @param {string} initial - The initial letter of the contact name.
 * @returns {string} The HTML string for the initial.
 */
function renderInitial(initial) {
  return /*html*/ `
  <div class="sort-contacts"><h4>${initial}</h4></div>
  <div class="border-container">
   <div class="border-grey"></div>
  </div>`;
}

/**
 * Renders the contact details.
 * @param {Object} contact - The contact object.
 * @param {number} i - The index of the contact in the list.
 * @returns {string} The HTML string for the contact.
 */
function renderContacts(contact, i) {
  let { initials, name } = extractInitialsAndName(contact);

  let randomColor = contact.color;
  return /*html*/ `
          <div onclick="showContact(${i})" class="contact" id="contact${i}">
              <div class="image-container" style="background-color: #${randomColor};">
                  <span>${initials}</span> 
              </div>
              <div class="contact-data">
                  <h4>${name}</h4>
                  <a href="#">${contact.email}</a>
              </div>
          </div>
  `;
}
