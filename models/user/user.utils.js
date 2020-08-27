const crypto = require('crypto');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);
const pbkdf2 = util.promisify(crypto.pbkdf2);

async function generatePasswordSalt() {
  return randomBytes(64)
    .then(buffer => buffer.toString('hex'));
}

async function encryptPassword(password, salt) {
  return pbkdf2(password, salt, 100, 64, 'sha512')
    .then(buffer => buffer.toString('hex'))
}

module.exports = {
  generatePasswordSalt,
  encryptPassword
};

