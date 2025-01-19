function generateHTMLsubtasksPopup(subtask) {
    return `
      <div class='subtask-popup-edit-container' id='subtask-popup-edit-container${subtask["id"]}'>
          <ul class='subtask-popup-ul-container'>
              <li>
                  ${subtask["subtitle"]}  
              </li>
              <div class='subtasks-edit-delete-container'>
                  <div class='subtasks-edit-container' onclick="editSubtask('${subtask["subtitle"]}', '${subtask["id"]}')">
                      <img src='/assets/img/edit_normal.svg'>
                  </div>
                  <div class='subtasks-seperator'></div>
                  <div onclick="deleteSubtask('${subtask["subtitle"]}')" class='subtasks-delete-container'>
                      <img src='/assets/img/delete.svg'>
                  </div>
              </div>
          </ul>
      </div>
      `;
  }

  
  function generateSubtaskHTML(subtaskTitle, id) {
    return `
      <div class="subtask-popup-edit-container" id="subtask-popup-edit-container${id}">
          <div class='display-flex'>
              <input id='subtaskInput${id}' type="text" value="${subtaskTitle}" class="subtask-edit-input">
              <div class='subtasks-edit-delete-container'>
                  <div onclick="deleteSubtask('${subtaskTitle}')" class='subtasks-delete-container margin-right-0'>
                      <img src='/assets/img/delete.svg'>
                  </div>
                  <div class='subtasks-seperator'></div>
                  <div onclick='saveChangedSubtask(${id})' class="subtasks-edit-container">
                      <img src="/assets/img/check-subtask.svg">
                  </div>
              </div>
          </div>
          <div class="subtask-edit-underline"></div>
      </div>`;
  }


  function contactListTemplate(initials, name, color, i) {
    let checked = checkMatchContact(i);
  
    if (checked) {
      return /*html*/ `
      <div onclick="assignContactToTask(${i}, event)" id="assigntContact${i}" style="background-color:var(--customized_darkblue)" class="assigned-contact-container">
      <div class="assigned-contact-child-container">
        <div class="assigned-contact-initials" style="background-color: #${color};">
          <h4>${initials}</h4>
        </div>
        <span style="color: white;" class="assigned-contact-name">${name}</span>
        </div>
     <div class="checkbox login">
          <div id="assignt-to${i}">
              <img class="uncheck-contact" style ="display:none;" id="img_check_off${i}" src="../assets/img/checkbox_unselected.svg" alt="">
              <img class="check-contact" style ="display:block;" id="img_check_on${i}" src="../assets/img/checked_white.svg" alt="">
          </div> 
      </div>
      `;
    } else {
      return /*html*/ `
      <div onclick="assignContactToTask(${i}, event)" id="assigntContact${i}" class="assigned-contact-container">
      <div class="assigned-contact-child-container">
        <div class="assigned-contact-initials" style="background-color: #${color};">
          <h4>${initials}</h4>
        </div>
        <span class="assigned-contact-name">${name}</span>
        </div>
     <div class="checkbox login">
          <div id="assignt-to${i}">
              <img class="uncheck-contact" style ="display:block;" id="img_check_off${i}" src="../assets/img/checkbox_unselected.svg" alt="">
              <img class="check-contact" style ="display:none;" id="img_check_on${i}" src="../assets/img/checked_white.svg" alt="">
          </div> 
      </div>
      `;
    }
  }


  function renderInitialsIcon(initials, color) {
    return /*html*/ `
      <div class="assigned-contact-initials" style="background-color: #${color};">
        <h4>${initials}</h4>
      </div>
    `;
  }