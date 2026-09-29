function normalizeStoredUserId(value) {
	let userId = String(value ?? '').trim();
	try {
		const parsed = JSON.parse(userId);
		if (typeof parsed === 'string') userId = parsed.trim();
	} catch {
		// Legacy sessions may store a plain string instead of JSON.
	}
	return userId.replace(/^["']+|["']+$/g, '').trim();
}

function syncLoggedInUser() {
	const userId = normalizeStoredUserId(localStorage.getItem('USER_ID'));
	if (!userId) return;

	chrome.runtime.sendMessage({
		type: 'DATA_FROM_LOGIN_PAGE',
		data: { user_id: userId },
	});
}

syncLoggedInUser();
window.addEventListener('pageshow', syncLoggedInUser);
document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible') syncLoggedInUser();
});
