const MAX_AVATAR_ID_LENGTH = 256;

export function normalizeAvatarId(value) {
	if (typeof value !== 'string') return null;
	const id = value.trim();
	if (!id || id.length > MAX_AVATAR_ID_LENGTH || /[\u0000-\u001f\u007f]/.test(id)) return null;
	return id;
}

export function resolveSafeHttpUrl(value, baseHref) {
	if (typeof value !== 'string' || !value.trim()) return null;
	const fallbackBase =
		baseHref ||
		(typeof document !== 'undefined'
			? document.baseURI
			: typeof location !== 'undefined'
				? location.href
				: null);
	if (!fallbackBase) return null;
	try {
		const url = new URL(value, fallbackBase);
		return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
	} catch {
		return null;
	}
}

export function isSafeCssColor(value) {
	if (typeof value !== 'string' || !value.trim() || value.length > 128) return false;
	if (/[;{}]|(?:url|var|image|attr)\s*\(/i.test(value)) return false;
	if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
		return CSS.supports('color', value);
	}
	return /^#[0-9a-f]{3,8}$/i.test(value);
}
