/**
 * This function is used to add event listeners and modifies the DOM based on the current page.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          if (document.getElementById('menubar')) {
            addEventListenersAndModifyDOM();
            observer.disconnect();
          }
        }
      });
  });

  const config = {
      childList: true,
      subtree: true
  };
  observer.observe(document.body, config);
});


/**
* This function is used to add event listeners and modify DOM
*/
function addEventListenersAndModifyDOM() {
  if (window.location.pathname.includes("legalNoticeLogin.html") ||
      window.location.pathname.includes("privacyPolicyLogin.html")) {
      hideHeaderIconsAndMenubar();
      adjustNavbarPrivacyContainerHeight();
      updatePrivacyPolicyAndLegalNoticeLinks();
  }
}


/**
* This function is used to hide header icons and menubar.
*/
function hideHeaderIconsAndMenubar() {
  document.getElementById('header-icons').style.display = 'none';
  document.getElementById('menubar').style.display = 'none';
}


/**
* This function is used to adjust the height of navbar-privacy-container.
*/
function adjustNavbarPrivacyContainerHeight() {
  document.getElementById('navbar-privacy-container').style.height = '561px';
}


/**
* This function is used to update the href attributes of privacy policy and legal notice links.
*/
function updatePrivacyPolicyAndLegalNoticeLinks() {
  document.getElementById('privacy-policy-link').href = '/html/privacyPolicyLogin.html';
  document.getElementById('legal-notice-link').href = '/html/legalNoticeLogin.html';
}