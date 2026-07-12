import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	isSafeCssColor,
	normalizeAvatarId,
	resolveSafeHttpUrl,
} from '../src/internal/safety.js';

const BASE = 'https://example.com/app/';

test('avatar ids reject control characters and excessive input', () => {
	assert.equal(normalizeAvatarId(' user/with space '), 'user/with space');
	assert.equal(normalizeAvatarId('bad\nid'), null);
	assert.equal(normalizeAvatarId('x'.repeat(257)), null);
	assert.equal(normalizeAvatarId(null), null);
});

test('UI links and images only accept HTTP(S) URLs', () => {
	assert.equal(resolveSafeHttpUrl('/docs', BASE), 'https://example.com/docs');
	assert.equal(resolveSafeHttpUrl('https://cdn.example/avatar.png', BASE), 'https://cdn.example/avatar.png');
	assert.equal(resolveSafeHttpUrl('javascript:alert(1)', BASE), null);
	assert.equal(resolveSafeHttpUrl('data:text/html,<script>alert(1)</script>', BASE), null);
	assert.equal(resolveSafeHttpUrl('http://[::1', BASE), null);
});

test('avatar accent accepts colors but rejects CSS injection primitives', () => {
	assert.equal(isSafeCssColor('#7aa2ff'), true);
	assert.equal(isSafeCssColor('url(https://attacker.example/track)'), false);
	assert.equal(isSafeCssColor('red; background-image:url(https://attacker.example)'), false);
	assert.equal(isSafeCssColor('var(--host-value)'), false);
});
