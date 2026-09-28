const LOGIN_ORIGIN = 'https://vanchuyenhoainam.vn';
const DASHBOARD_API_BASE = 'https://api-agent.dttech.site/api';
const TASK_POLL_INTERVAL_MS = 1500;
const TASK_POLL_TIMEOUT_MS = 90000;
let orderSubmissionInProgress = false;

window.addEventListener('load', init);

async function init() {
	if (window.location.origin === LOGIN_ORIGIN) return;

	const userData = await getUserData();
	if (!userData?.user_id) {
		alert(
			'-- Vận Chuyển Hoài Nam --\n\nBạn chưa đăng nhập. Vui lòng đăng nhập trước, sau đó quay lại trang sản phẩm.'
		);
		return;
	}

	createOrderUi();
}

function getUserData() {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type: 'GET_USER_DATA' }, (response) => {
			if (chrome.runtime.lastError) {
				console.error('Không thể lấy user session:', chrome.runtime.lastError.message);
				resolve(null);
				return;
			}
			resolve(response || null);
		});
	});
}

function normalizeUserId(value) {
	let userId = String(value ?? '').trim();
	try {
		const parsed = JSON.parse(userId);
		if (typeof parsed === 'string') userId = parsed.trim();
	} catch {
		// The current site may store USER_ID as a plain string.
	}
	return userId.replace(/^["']+|["']+$/g, '').trim();
}

function createOrderUi() {
	if (document.getElementById('order-ui-container')) return;

	const container = document.createElement('div');
	container.id = 'order-ui-container';
	Object.assign(container.style, {
		position: 'fixed',
		bottom: '20px',
		right: '20px',
		zIndex: '2147483647',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		gap: '10px',
		width: '270px',
		fontFamily: 'Arial, sans-serif',
	});

	const noteInput = document.createElement('textarea');
	noteInput.id = 'user-note';
	noteInput.placeholder = 'Nhập ghi chú yêu cầu của bạn...';
	Object.assign(noteInput.style, {
		height: '74px',
		borderRadius: '7px',
		padding: '10px',
		fontSize: '14px',
		resize: 'none',
		backgroundColor: '#fff',
		border: '1px solid #ccc',
		boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
		outline: 'none',
	});

	const actions = document.createElement('div');
	Object.assign(actions.style, { display: 'flex', gap: '8px' });

	const orderButton = createButton('Đặt hàng', '#ff7f00');
	orderButton.id = 'order-button';
	orderButton.addEventListener('click', () => submitOrderTask(orderButton));

	const cartButton = createButton('Giỏ hàng', '#1671c5');
	cartButton.id = 'cart-button';
	cartButton.addEventListener('click', () => {
		window.open(`${LOGIN_ORIGIN}/gio-hang`, '_blank', 'noopener,noreferrer');
	});

	actions.append(orderButton, cartButton);
	container.append(noteInput, actions);
	document.body.appendChild(container);
}

function createButton(label, backgroundColor) {
	const button = document.createElement('button');
	button.textContent = label;
	Object.assign(button.style, {
		flex: '1',
		padding: '11px 14px',
		backgroundColor,
		color: '#fff',
		fontSize: '14px',
		fontWeight: '700',
		borderRadius: '7px',
		border: 'none',
		cursor: 'pointer',
		boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
	});
	return button;
}

function getPlatform() {
	const host = window.location.hostname;
	if (host.includes('1688.com')) return '1688';
	if (host.includes('tmall.com')) return 'tmall';
	if (host.includes('taobao.com')) return 'taobao';
	return 'unknown';
}

function normalizeImageUrl(value) {
	if (!value || typeof value !== 'string') return null;
	const rawUrl = value.trim();
	if (!rawUrl || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) return null;

	try {
		const url = new URL(rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl, location.href);
		if (!['http:', 'https:'].includes(url.protocol)) return null;
		return url.href;
	} catch {
		return null;
	}
}

function collectProductImages() {
	const candidates = new Map();
	const addCandidate = (value, source, element = null, priority = 0) => {
		const url = normalizeImageUrl(value);
		if (!url) return;
		const candidate = {
			url,
			source,
			alt: element?.getAttribute?.('alt')?.trim().slice(0, 300) || '',
			width: Number(element?.naturalWidth || element?.width || 0),
			height: Number(element?.naturalHeight || element?.height || 0),
			priority,
		};
		const existing = candidates.get(url);
		if (!existing || candidate.priority > existing.priority) candidates.set(url, candidate);
	};
	const addImage = (image, source, priority) => {
		[
			image.currentSrc,
			image.src,
			image.getAttribute('data-src'),
			image.getAttribute('data-lazyload'),
			image.getAttribute('data-ks-lazyload'),
			image.getAttribute('data-original'),
		].forEach((value) => addCandidate(value, source, image, priority));
	};

	document.querySelectorAll('video[poster]').forEach((video) => {
		addCandidate(video.poster || video.getAttribute('poster'), 'video-poster', video, 100);
	});
	document.querySelectorAll('video').forEach((video) => {
		const videoBounds = video.getBoundingClientRect();
		Array.from(document.images)
			.filter((image) => {
				const bounds = image.getBoundingClientRect();
				return (
					(image.naturalWidth >= 40 || image.naturalHeight >= 40) &&
					bounds.top >= videoBounds.top - 10 &&
					bounds.bottom <= videoBounds.bottom + 10 &&
					bounds.right <= videoBounds.left + 30
				);
			})
			.forEach((image) => addImage(image, 'video-gallery-thumbnail', 95));
	});

	[
		['meta[property="og:image"]', 'content'],
		['meta[name="twitter:image"]', 'content'],
		['link[rel="image_src"]', 'href'],
	].forEach(([selector, attribute]) => {
		document
			.querySelectorAll(selector)
			.forEach((element) =>
				addCandidate(element.getAttribute(attribute), 'metadata', element, 80)
			);
	});

	const productImageSelectors = [
		'.tb-main-pic img',
		'[class*="mainPic"] img',
		'[class*="MainPic"] img',
		'[class*="mainImage"] img',
		'[class*="MainImage"] img',
		'[class*="gallery"] img',
		'[class*="Gallery"] img',
		'[class*="preview"] img',
		'[class*="Preview"] img',
		'[class*="sku"] img',
		'[class*="Sku"] img',
	];
	document
		.querySelectorAll(productImageSelectors.join(','))
		.forEach((image) => addImage(image, 'product-area', 90));

	document
		.querySelectorAll(
			'video, [class*="video"], [class*="Video"], [class*="gallery"], [class*="Gallery"], [class*="preview"], [class*="Preview"]'
		)
		.forEach((element) => {
			const backgroundImage = getComputedStyle(element).backgroundImage;
			for (const match of backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
				addCandidate(match[1], 'media-background', element, 85);
			}
		});

	Array.from(document.images)
		.filter((image) => {
			const bounds = image.getBoundingClientRect();
			const largeEnough =
				image.naturalWidth >= 40 ||
				image.naturalHeight >= 40 ||
				image.width >= 40 ||
				image.height >= 40;
			return (
				largeEnough &&
				bounds.bottom >= 0 &&
				bounds.top <= window.innerHeight * 1.5 &&
				bounds.left <= window.innerWidth * 0.65
			);
		})
		.slice(0, 40)
		.forEach((image) => addImage(image, 'visible-gallery-thumbnail', 70));

	Array.from(document.images)
		.filter(
			(image) =>
				image.naturalWidth >= 180 ||
				image.naturalHeight >= 180 ||
				image.width >= 180 ||
				image.height >= 180
		)
		.sort(
			(a, b) =>
				(b.naturalWidth || b.width) * (b.naturalHeight || b.height) -
				(a.naturalWidth || a.width) * (a.naturalHeight || a.height)
		)
		.slice(0, 40)
		.forEach((image) => addImage(image, 'visible-large-image', 60));

	const images = Array.from(candidates.values())
		.sort(
			(a, b) =>
				b.priority - a.priority || b.width * b.height - a.width * a.height
		)
		.slice(0, 40)
		.map(({ priority, ...image }) => image);
	return { primaryImage: images[0]?.url || null, images };
}

function collectShopCandidates() {
	const candidates = new Map();
	const addCandidate = (value, source, priority) => {
		const name = String(value ?? '')
			.replace(/\s+/g, ' ')
			.trim();
		if (name.length < 2 || name.length > 120) return;
		if (/^(进入店铺|进店|店铺|联系客服|客服|store|shop|contact seller)$/i.test(name)) return;
		const existing = candidates.get(name);
		if (!existing || priority > existing.priority) {
			candidates.set(name, { name, source, priority });
		}
	};

	[
		'meta[property="og:site_name"]',
		'meta[name="author"]',
	].forEach((selector) => {
		document
			.querySelectorAll(selector)
			.forEach((element) => addCandidate(element.getAttribute('content'), 'metadata', 60));
	});

	const shopSelectors = [
		'.shop-name',
		'.seller-name',
		'[class*="shopName"]',
		'[class*="ShopName"]',
		'[class*="shop-name"]',
		'[class*="sellerName"]',
		'[class*="SellerName"]',
		'[class*="storeName"]',
		'[class*="StoreName"]',
		'[class*="shopHeader"]',
		'[class*="ShopHeader"]',
		'a[href*="shop/view_shop"]',
		'a[href*="shop.taobao.com"]',
		'a[href*="tmall.com/shop"]',
		'a[href*="winport.1688.com"]',
	];
	document.querySelectorAll(shopSelectors.join(',')).forEach((element) => {
		addCandidate(element.textContent, 'shop-element', 100);
		addCandidate(element.getAttribute('title'), 'shop-title', 95);
		addCandidate(element.getAttribute('aria-label'), 'shop-label', 90);
	});

	return Array.from(candidates.values())
		.sort((a, b) => b.priority - a.priority)
		.slice(0, 10)
		.map(({ priority, ...candidate }) => candidate);
}

function buildPageSnapshot() {
	const candidateSelectors = [
		'#skuSelection',
		'.pc-sku-wrapper',
		'.single-sku-box',
		'.gyp-sku-selector-wrap',
		'.pc-sku-gyp-more-dimension-wrapper',
		'.specific-table',
		'[class*="skuWrapper--"]',
		'[class*="MainTitle"]',
		'[class*="mainTitle"]',
		'[class*="price"]',
	];
	const snapshotRoot = document.createElement('div');
	const candidates = Array.from(
		document.querySelectorAll(candidateSelectors.join(','))
	).slice(0, 30);

	for (const candidate of candidates) {
		const clone = candidate.cloneNode(true);
		clone.querySelectorAll('script, style, svg, iframe, noscript').forEach((element) => {
			element.remove();
		});
		clone.querySelectorAll('*').forEach(removeUnneededAttributes);
		snapshotRoot.appendChild(clone);
	}

	const controls = Array.from(
		document.querySelectorAll('input, textarea, select, [role="spinbutton"]')
	)
		.filter((element) => element.id !== 'user-note')
		.slice(0, 200)
		.map((element) => ({
			tag: element.tagName.toLowerCase(),
			type: element.type || null,
			name: element.name || null,
			value: element.value || element.getAttribute('aria-valuenow') || '',
			checked: Boolean(element.checked),
			ariaLabel: element.getAttribute('aria-label'),
			nearbyText: element.parentElement?.innerText?.trim().slice(0, 500) || '',
		}));

	const productImages = collectProductImages();
	return {
		pageTitle: document.title,
		visibleText: document.body?.innerText?.trim().slice(0, 25000) || '',
		html: snapshotRoot.innerHTML.slice(0, 60000),
		controls,
		shopCandidates: collectShopCandidates(),
		primaryImage: productImages.primaryImage,
		images: productImages.images,
	};
}

function removeUnneededAttributes(element) {
	const allowed = new Set(['class', 'id', 'title', 'alt', 'src', 'value', 'role']);
	for (const attribute of Array.from(element.attributes)) {
		if (
			!allowed.has(attribute.name) &&
			!attribute.name.startsWith('aria-') &&
			!attribute.name.startsWith('data-')
		) {
			element.removeAttribute(attribute.name);
		}
	}
}

function setTaskStatus(message, state = 'working') {
	let status = document.getElementById('order-task-status');
	if (!status) {
		status = document.createElement('div');
		status.id = 'order-task-status';
		Object.assign(status.style, {
			padding: '10px 12px',
			borderRadius: '7px',
			fontSize: '13px',
			lineHeight: '1.35',
			color: '#fff',
		});
		document.getElementById('order-ui-container')?.prepend(status);
	}
	status.style.backgroundColor =
		state === 'success' ? '#16803c' : state === 'error' ? '#c62828' : '#333';
	status.textContent = message;
}

async function submitOrderTask(button) {
	if (orderSubmissionInProgress) return;
	orderSubmissionInProgress = true;
	const originalLabel = button.textContent;
	button.disabled = true;
	button.style.opacity = '0.65';
	button.style.cursor = 'not-allowed';
	button.textContent = 'Đang xử lý...';
	setTaskStatus('Đang gửi dữ liệu sản phẩm...');

	try {
		const userData = await getUserData();
		if (!userData?.user_id) {
			throw new Error('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
		}
		const response = await fetch(`${DASHBOARD_API_BASE}/extension/tasks`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				client_request_id: crypto.randomUUID(),
					user_id: normalizeUserId(userData.user_id),
				platform: getPlatform(),
				page_url: window.location.href,
				user_note: document.getElementById('user-note')?.value || '',
				snapshot: buildPageSnapshot(),
			}),
		});
		const task = await response.json();
		if (!response.ok) throw new Error(task.message || 'Không thể tạo task');

		await pollTask(task.id);
	} catch (error) {
		console.error('Dashboard task failed:', error);
		setTaskStatus(error.message || 'Không thể xử lý đơn hàng.', 'error');
	} finally {
		orderSubmissionInProgress = false;
		button.disabled = false;
		button.style.opacity = '1';
		button.style.cursor = 'pointer';
		button.textContent = originalLabel;
	}
}

async function pollTask(taskId) {
	const startedAt = Date.now();
	while (Date.now() - startedAt < TASK_POLL_TIMEOUT_MS) {
		await delay(TASK_POLL_INTERVAL_MS);
		const response = await fetch(
			`${DASHBOARD_API_BASE}/extension/tasks/${encodeURIComponent(taskId)}`
		);
		const task = await response.json();
		if (!response.ok) throw new Error(task.message || 'Không đọc được task');

		if (task.status === 'success') {
			setTaskStatus(task.message || 'Đặt hàng thành công!', 'success');
			return;
		}
		if (['failed', 'needs_confirmation', 'cancelled'].includes(task.status)) {
			throw new Error(task.message || 'Task xử lý không thành công');
		}
		setTaskStatus(`Đang xử lý: ${task.stage || task.status}`);
	}
	throw new Error('Task quá thời gian chờ. Vui lòng kiểm tra dashboard.');
}

function delay(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
