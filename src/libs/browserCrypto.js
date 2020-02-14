// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
// https://github.com/mdn/dom-examples/blob/master/web-crypto/encrypt-decrypt/aes-cbc.js
async function cryptByBrowserApi(plainText, key, iv) {
	console.log('平文: ' + plainText);
	console.log("crypt.key:", key);
	console.log("crypt.iv:", iv);

	const encrypted = await window.crypto.subtle.encrypt(
		{
			name: "AES-CBC",
			iv
		},
		key,
		new TextEncoder().encode(plainText)
	);
	console.log('暗号化:', encrypted);
	console.log('暗号化:', Buffer.from(encrypted).toString('hex'));
	return encrypted;
}

// https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/decrypt
// https://github.com/mdn/dom-examples/blob/master/web-crypto/encrypt-decrypt/aes-cbc.js
async function decryptByBrowserApi(encrypted, key, iv) {
	console.log("decrypt.encrypted:", encrypted);
	console.log("decrypt.key:", key);
	console.log("decrypt.iv:", iv);
	const decrypted = await window.crypto.subtle.decrypt(
		{
			name: "AES-CBC",
			iv,
		},
		key,
		encrypted
	);

	const plainText = new TextDecoder().decode(decrypted);
	console.log('復号化:', plainText);

	return plainText;
}

// https://github.com/mdn/dom-examples/blob/master/web-crypto/import-key/raw.js
async function importKeyByBrowserApi(rawKey) {
	const key = await window.crypto.subtle.importKey(
		"raw",
		rawKey,
		"AES-CBC",
		true,
		["encrypt", "decrypt"]
	);
	return key;
}

// https://github.com/mdn/dom-examples/blob/master/web-crypto/encrypt-decrypt/aes-cbc.js
async function generateKeyByBrowserApi() {
	const key = window.crypto.subtle.generateKey(
		{
			name: "AES-CBC",
			length: 256
		},
		true,
		["encrypt", "decrypt"]
	);
	return key;
}

export {
	cryptByBrowserApi, decryptByBrowserApi, generateKeyByBrowserApi, importKeyByBrowserApi
}
