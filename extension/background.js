// Session storage survives service-worker suspension but is cleared with the
// browser session, matching the lifetime expected for login state.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'GET_USER_DATA') {
		chrome.storage.session.get('userDataFromLoginPage', (result) => {
			sendResponse(result.userDataFromLoginPage || null);
		});
		return true;
	}
	if (message.type === 'DATA_FROM_LOGIN_PAGE') {
		chrome.storage.session.set({ userDataFromLoginPage: message.data });
	}
});
