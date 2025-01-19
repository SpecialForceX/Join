/**
 * This function is used to initialize important functions to legal sites
 */
async function init() {
    await initInclude();
    await loadAllData('loginData');
    getProfileInitials();
}