/**
 * This function is used to update the navigation menu to highlight the selected menu item based on the current page.
 */
function selectMenu() {
    const menuItems = getMenuItems();

    removeSelectionFromMenuItems(menuItems);
    highlightSelectedMenuItem(menuItems);
}


/**
 * This function is used to retrieve all menu items from the navigation menu.
 * 
 * @returns {HTMLElement[]} An array containing all menu item elements.
 */
function getMenuItems() {
    return [
        document.getElementById('summary-menu'),
        document.getElementById('addTask-menu'),
        document.getElementById('board-menu'),
        document.getElementById('contacts-menu')
    ];
}


/**
 * This function is used to remove the 'selected-menu' class from all menu items.
 * 
 * @param {HTMLElement[]} menuItems - An array containing all menu item elements.
 */
function removeSelectionFromMenuItems(menuItems) {
    menuItems.forEach(item => {
        item.classList.remove('selected-menu');
    });
}


/**
 * This function is used to highlight the menu item corresponding to the current page.
 * 
 * @param {HTMLElement[]} menuItems - An array containing all menu item elements.
 */
function highlightSelectedMenuItem(menuItems) {
    const currentPagePath = window.location.pathname;

    menuItems.forEach(item => {
        const pageName = item.id.replace('-menu', '');
        if (currentPagePath.includes(`${pageName}.html`)) {
            item.classList.add('selected-menu');
            if (pageName === 'addTask') {
                selectDefaultPrio('button-medium');
            }
        }
    });
}