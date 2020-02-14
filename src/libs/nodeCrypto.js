// https://nodejs.org/api/crypto.html#crypto_class_cipher
import crypto from 'crypto';

function createCipheriv(algorithm, key, iv) {
	console.log("crypt.key:", key);
	console.log("crypt.iv:", iv);

	const cipher = crypto.createCipheriv(algorithm, key, iv);
	return cipher;
}

function createDecipheriv(algorithm, key, iv) {
	console.log("decrypt.key:", key);
	console.log("decrypt.iv:", iv);

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	return decipher;
}

async function cryptByNodeApi(cipher, plainText) {
	console.log('平文: ' + plainText);

	let encrypted = cipher.update(plainText, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	console.log('暗号化:', encrypted);

	return encrypted;
}

async function decryptByNodeApi(decipher, encrypted) {
	// 復号
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	console.log('復号化: ', decrypted);

	return decrypted;
}

export {
	createCipheriv, createDecipheriv,
	cryptByNodeApi, decryptByNodeApi
}
