/**
 * This function is used to initialize the HTML include functionality and selects the appropriate menu item.
 */
async function initInclude() {
    await includeHTML();
    selectMenu();
}

/**
 * This function is used to include HTML content into elements with 'w3-include-html' attribute.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}