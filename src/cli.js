import crypto from 'crypto';

import { cryptByNodeApi, decryptByNodeApi, createCipheriv, createDecipheriv } from './libs/nodeCrypto';

const plainText = "ソンナコトナイヨ";

async function handleClickNode() {
	const algorithm = 'aes-256-cbc';
	 
	// Key length is dependent on the algorithm. In this case for aes256, it is
	// 32 bytes (256 bits).
	// Use async `crypto.scrypt()` instead.
	const password = "your password";
    const key = crypto.scryptSync(password, 'salt', 32); // <= not implemented on browser

	// Use `crypto.randomBytes()` to generate a random iv instead of the static iv shown here.
	const iv = Buffer.alloc(16, 0); // Must be a 128 bits

	const cipher = createCipheriv(algorithm, key, iv);
	const encrypted = await cryptByNodeApi(cipher, plainText);

	const decipher = createDecipheriv(algorithm, key, iv);
	await decryptByNodeApi(decipher, encrypted);
}

handleClickNode();
