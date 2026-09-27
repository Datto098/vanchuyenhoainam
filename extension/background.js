// Cấu hình URL trang đăng nhập
const LOGIN_URL = 'https://vanchuyenhoainam.vn/';

// Lắng nghe khi người dùng chuyển sang tab khác
chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		handleTab(tab);
	});
});

// Lắng nghe khi URL của tab thay đổi (ví dụ: chuyển giữa các trang trong 1 tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		handleTab(tab);
	}
});

// Hàm xử lý logic kiểm tra URL
function handleTab(tab) {
	const url = tab.url || '';
	// Kiểm tra nếu URL là trang đăng nhập
	if (url.includes(LOGIN_URL)) {
		// Chèn script vào trang hiện tại để đọc localStorage
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			func: extractUserDataFromLocalStorage,
		});
	}
}

// Hàm để đọc dữ liệu từ localStorage của trang
function extractUserDataFromLocalStorage() {
	const storedUserId = localStorage.getItem('USER_ID');
	let USERID = storedUserId?.trim() || '';
	try {
		const parsed = JSON.parse(USERID);
		if (typeof parsed === 'string') USERID = parsed.trim();
	} catch {
		// Some legacy sessions store a plain string instead of JSON.
	}
	USERID = USERID.replace(/^["']+|["']+$/g, '').trim();

	if (USERID) {
		// Gửi dữ liệu về background
		chrome.runtime.sendMessage({
			type: 'DATA_FROM_LOGIN_PAGE',
			data: { user_id: USERID },
		});
	}
}

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
