/**
 * this function generates the HTML for the small Tasks
 * 
 * @param {object} card This is the task object which includes all relevant informations for one task
 * @returns HTML for small Tasks
 */
function generateTaskHTML(card) {
    return `
    <div id='${card['id']}' onclick="showMovableContainer('show', 'bigCard'); renderBigCard(${card['id']});" draggable='true' 
    ondragstart='startDragging(${card['id']})' class='small-card-container'
    ontouchstart='startTouching(${card['id']}, event)' 
    ontouchmove='touchMove(event)' 
    ontouchend='touchEnd(event)' >
        ${checkCategory(card)}
        <div class='small-card-text-container'>
            <p class='small-card-title'>${card['title']}</p>
            <p class='small-card-description'>${createShortDescription(card['id'])}</p>
            ${checkSubtasks(card, 'small-card')}
            <div class='contacts-prio-container'>
                <div class='contacts-order'>
                    ${checkAssignedTo(card, 'small-card')}
                </div>
                ${setPrio(card)}
            </div>
        </div>
    </div>
    `;
}


/**
 * this function generates HTML for the empty column message
 * 
 * @param {string} column this contains the name of the respective column as a string
 * @returns HTML message for empty columns
 */
function generateEmptyColumnHTML(column) {
    return `
        <div class='empty-column-container'>
            <span>No tasks ${column}</span>
        </div>
    `
}


/**
 * This function check the category of a task and generates the respective HTML. True is User Story, False is Technical Task
 * 
 * @param {object} card This is the task object which includes all relevant informations for one task
 * @returns HTML for category section
 */
function checkCategory(card) {
    let categoryHTML = '';
    if (card.category) {
        categoryHTML = `
        <div id='category-container${card['id']}' class='category-container story-container'>
            <p>User Story</p>
        </div>
        `
    }
    else {
        categoryHTML = `
        <div id='category-container${card['id']}' class='category-container technical-container'>
            <p>Technical Task</p>
        </div>
        `
    }
    return categoryHTML;
}


/**
 * This function generates the icon with initials HTML for small task view
 * 
 * @param {Array} initialsArray This contains the initials from the contacts who is assigned to the task
 * @param {Array} colors This contains the color which is assigned to the contact
 * @returns HTML of icon with initials
 */
function generateHTMLAssignedTo(initialsArray, colors) {
    let circlesHTML = '';

    for (let i = 0; i < initialsArray.length; i++) {
        circlesHTML += `
            <div class='circle' style='background-color: #${colors[i]};'>
                <div class='initials'>${initialsArray[i]}</div>
            </div>
        `;
    }

    return circlesHTML;
}


/**
 * This function generates the icon with initials and full name HTML for big task view
 * 
 * @param {Array} initialsArray This contains the initials from the contacts who is assigned to the task
 * @param {object} card This is the task object which includes all relevant informations for one task
 * @param {Array} colors This contains the color which is assigned to the contact
 * @returns HTML of icon with initials and full name
 */
function generateHTMLAssignedToBigCard(initialsArray, card, colors) {
    let circlesHTML = '';

    for (let i = 0; i < initialsArray.length; i++) {
        let contactIndex = everyContactList.findIndex(c => c.id == card['asigntTo'][i]);
        let contactName = everyContactList[contactIndex]['name'];
        circlesHTML += `
        <div class='big-card-one-assign'>
            <div class='circle-big-card' style='background-color: #${colors[i]};'>
                <div class='initials'>${initialsArray[i]}</div>
            </div>
            <div class='assigned-to-txt'>${contactName}</div>
        </div>
        `;
    }
    return circlesHTML;
}


/**
 * This function get the prio of the respective task and returns the priority section HTML for small task view
 * 
 * @param {object} card This is the task object which includes all relevant informations for one task
 * @returns HTML of priority section
 */
function setPrio(card) {
    switch (card.prio) {
        case 'Low':
            return `<img src='/assets/img/prio_small_cards_low.svg'>`
            break;
        case 'Medium':
            return `<img src='/assets/img/prio_small_cards_medium.svg'>`
            break;
        case 'Urgent':
            return `<img src='/assets/img/prio_small_cards_urgent.svg'>`
            break;
    }
}


/**
 * This function generates the HTML of the big task view
 * 
 * @param {object} currentCard This is the task object which includes all relevant informations for one task
 * @returns HTML of big task view
 */
function generateHTMLbigCard(currentCard) {
    return `
    <div class='space-between'>
            ${checkCategoryBigCard(currentCard)}
        <div onclick="showMovableContainer('remove', 'bigCard'), changeBigCardContainer(), resetAssignTo()" class='close-img-container'>
            <img src='/assets/img/close.svg'>
        </div>
    </div>
    <p class='big-card-title'>${currentCard['title']}</p>
    <p class='big-card-description'>${currentCard['description']}</p>
    <div class='big-card-date-container'>
        <p class='big-card-data-txt'>Due date:</p>
        <p class='big-card-data'>${currentCard['date']}</p>
    </div>
    <div class='big-card-prio-container'>
        <p class='big-card-data-txt'>Priority:</p>
        <div class='big-card-prio'>
            <p class='big-card-data'>${currentCard['prio']}</p>
            ${setPrio(currentCard)}
        </div>
    </div>
    <div class='big-card-assigned-container'>
        <p class='big-card-data-txt'>Assigned To:</p>
        <div>
            <div class='big-card-assigned-names'>
                ${checkAssignedTo(currentCard, 'big-card')}
            </div>
        </div>
    </div>
    <div class='big-card-subtasks-container'>
        <p class='big-card-data-txt'>Subtasks</p>
        <div>
            <div class='big-card-subtasks'>
                ${checkSubtasks(currentCard, 'big-card')}
            </div>
        </div>
    </div>
    <div class='flex-end'>
        <div class='delete-edit-container'>
            <div onclick='deleteTask(${currentCard['id']}), resetAssignTo()' class='delete-container'>
                <div class='delete-img'>
                    <div class='delete-icon'></div>
                </div>
                <p class='delete-txt'>Delete</p>
            </div>
            <div class='seperator-delete'></div>
            <div onclick="showEditTask(${currentCard['id']}); changeBigCardContainer('edit'); renderEditBigCardSubtasks(${currentCard['id']})" class='edit-container'>
                <div class='edit-img'>
                    <div class='edit-icon'></div>
                </div>
                <p class='edit-txt'>Edit</p>
            </div>
        </div>
    </div>
    `
}


/**
 * This function generates the HTML of the task editor
 * 
 * @param {number} indexOfCurTask This contains the index of the respective task
 * @returns HTML of task editor
 */
function generateHTMLEditTask(indexOfCurTask) {
    return `
    <div class='input-edit-cross'>
        <div onclick="showMovableContainer('remove', 'bigCard'); changeBigCardContainer(); resetForm()" class='close-img-container'>
            <img src='/assets/img/close.svg'>
        </div>
    </div>
    <div class='edit-content'>
        <div class='input-title-section'>
            <p>Title</p>
            <div class='input-title-field-section'>
                <input id='input-title${indexOfCurTask}' type='text' class='input-title-field' value='${tasks[indexOfCurTask]['title']}'>
                
            </div>
        </div>
        <div class='input-description-section'>
            <p class='input-txt'>Description</p>
            <div>
                <textarea id='input-description${indexOfCurTask}' class='input-title-field edit-textarea'>${tasks[indexOfCurTask]['description']}</textarea>
            </div>
        </div>
        <div class='input-date-section'>
            <p class='input-txt'>Due Date</p>
            <div>
                <input id='input-date${indexOfCurTask}' type='date' class='input-title-field' value='${tasks[indexOfCurTask]['date']}'>
            </div>
        </div>
        <div class='input-prio-section'>
            <p class='input-txt'>Priority</p>
            <div>
            <div class="prio-container">
            <button class="button-prio" id="button-urgent" type="button" onclick="getPrio('Urgent')">
              Urgent<img id="img-urgent" src="/assets/img/urgent.svg" />
            </button>
            <button class="button-prio" id="button-medium" type="button" onclick="getPrio('Medium')">
              Medium<img id="img-medium" src="/assets/img/medium.svg" />
            </button>
            <button class="button-prio" id="button-low" type="button" onclick="getPrio('Low')">
              Low<img id="img-low" src="/assets/img/low.svg" />
            </button>
          </div>
            </div>
        </div>
        <span class="task-description-span">Assigned to</span>
              <div onclick="toggleContactsToAssign(event)" class="add-task-input-container mb input-field-assigntTo">
                <input onkeydown="searchContact()" placeholder="Select contacts to assign" class="contacts-assign"
                  id="input-assignTo" autocomplete="off">
                <img id="drop-down-arrow" src="/assets/img/arrow_drop_down.svg">
              </div>
              <div class="drop-down-contacts margin-bottom-64">
                <div class='renderdContacts' id="selected-contacts">
                 
                </div>
                <div class="contacts-list" id="contacts-list"></div>
              </div>
        <span class="task-deadline-span">Subtasks</span>
          <div class="add-task-input-container margin-bottom-0">
            <input oninput="checkInput('', ${indexOfCurTask})" class="subtask-input" type="text" placeholder="Add new subtask"
              id="subtasks-input${indexOfCurTask}" />
            <img id="subtasks-popup-empty-img${indexOfCurTask}" src="/assets/img/add.svg" />
            <div id="subtasks-popup-full-img${indexOfCurTask}" class="subtasks-popup-full-container">
              <div onclick="clearSubtaskInput('', ${indexOfCurTask}), checkInput('', ${indexOfCurTask})" class="subtask-popup-img-container">
                <img src="/assets/img/cancel.svg" alt="cross-img">
              </div>
              <div class="subtasks-popup-seperator"></div>
              <div onclick="addSubtaskInEditor(${indexOfCurTask}), clearSubtaskInput('', ${indexOfCurTask}), checkInput('', ${indexOfCurTask})" class="subtask-popup-img-container">
                <img src="/assets/img/check-subtask.svg" alt="check-img">
              </div>
            </div>
          </div>
          <div class="subtasks-popup-section" id="subtasks-popup-section${indexOfCurTask}">
            
          </div>
    </div>
    <div onclick='editTask(${indexOfCurTask}), changeBigCardContainer()' class='edit-task-btn-container'>
        <button class='button_full ctask'>
                <div>
                    OK
                </div>
        </button>
    </div>
    `
}


/**
 * This function generates HTML for the subtasks section in the small task view
 * 
 * @param {number} amountOfSubtasks This contains the amount of all subtasks that a task contains
 * @param {object} card This is the task object which includes all relevant informations for one task
 * @param {number} amountOfCheckedSubtasks This contains the amount of all checked subtasks in a task
 * @returns HTML for subtask section
 */
function generateHTMLsubtasks(amountOfSubtasks, card, amountOfCheckedSubtasks) {
    return `
        <div class='progress-container'>
            <div class='popup-progressbar'>${amountOfCheckedSubtasks} von ${amountOfSubtasks} Subtasks erledigt!</div>
            <div class="progress-bar">
                <div id='progress${card['id']}' class="progress"></div>
            </div>
            <div class='progress-txt-container'>
                <p id='subtasks-amount${card['id']}'>${amountOfCheckedSubtasks}/${amountOfSubtasks} Subtasks</p>
            </div>
        </div> 
    `
}


/**
 * This function generates HTML for the subtasks section in the task editor view
 * 
 * @param {*} subtask This is the subtask object which includes all relevant informations for one subtask 
 * @param {*} cardId This contains the unique id of the task
 * @returns HTML for subtasks section
 */
function generateHTMLsubtasksEdit(subtask, cardId) {
    return `
    <div class='subtask-popup-edit-container' id='subtask-popup-edit-container${subtask["id"]}'>
        <ul class='subtask-popup-ul-container'>
            <li>
                ${subtask["subtitle"]}  
            </li>
            <div class='subtasks-edit-delete-container'>
                <div class='subtasks-edit-container' onclick="editSubtaskBigCard('${subtask["subtitle"]}', '${subtask["id"]}', ${cardId})">
                    <img src='/assets/img/edit_normal.svg'>
                </div>
                <div class='subtasks-seperator'></div>
                <div onclick="deleteEditSubtask('${subtask["id"]}', ${cardId})" class='subtasks-delete-container'>
                    <img src='/assets/img/delete.svg'>
                </div>
            </div>
        </ul>
    </div>
    `
}


/**
 * This function is used to generate HTML for editing subtask
 * 
 * @param {*} subtaskTitle this contains the subtask title
 * @param {*} id This contains an id to set unique div ids
 * @param {*} cardId This contains the unique id of the task
 * @returns HTML for editing subtasks
 */
function generateSubtaskEditBigCardHTML(subtaskTitle, id, cardId) {
    return `
      <div class="subtask-popup-edit-container" id="subtask-popup-edit-container${id}">
          <div class='display-flex'>
              <input id='subtaskInput${id}' type="text" value="${subtaskTitle}" class="subtask-edit-input">
              <div class='subtasks-edit-delete-container'>
                  <div onclick="deleteEditSubtask('${subtaskTitle}', ${cardId})" class='subtasks-delete-container margin-right-0'>
                      <img src='/assets/img/delete.svg'>
                  </div>
                  <div class='subtasks-seperator'></div>
                  <div onclick='saveChangedSubtaskInEditor(${id}, ${cardId})' class="subtasks-edit-container">
                      <img src="/assets/img/check-subtask.svg">
                  </div>
              </div>
          </div>
          <div class="subtask-edit-underline"></div>
      </div>`;
}


/**
 * This function generates HTML for subtasks section in big task view
 * 
 * @param {*} amountOfSubtasks This contains the amount of all subtasks that a task contains
 * @param {*} card This is the task object which includes all relevant informations for one task
 * @returns HTML for subtasks section
 */
function generateHTMLsubtasksBig(amountOfSubtasks, card) {
    let subtasksHTML = '';

    for (let i = 0; i < amountOfSubtasks; i++) {
        const subtask = card['subTasks'][i];
        let checked = subtask['checked'];

        subtasksHTML += `
        <div class='big-card-one-subtask'>
            <input type='checkbox' id="myCheckbox${i}" onclick="saveCheckedSubtask(${card['id']}, ${i}, '${subtask['subtitle']}')" ${checked}>
            <label for="myCheckbox${i}" class="checkbox-label">
                <img src="/assets/img/checkbox_unselected.svg" class="checkbox-img unchecked">
                <img src="/assets/img/checkbox_selected.svg" class="checkbox-img checked">
            </label>
            <div class='subtasks-txt'>${subtask['subtitle']}</div>
        </div>
    `
    }
    return subtasksHTML;
}