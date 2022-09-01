const { randomBytes } = require('crypto');
const { promisify } = require('util');

async function createSecret() {
	const buff = await promisify(randomBytes)(32);
	console.log(buff.toString('base64'));
}

createSecret();
