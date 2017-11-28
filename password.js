const crypto = require("crypto");
const util = require("util");

const pbkdf2 = util.promisify(crypto.pbkdf2);
const randomBytes = util.promisify(crypto.randomBytes);

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const SALT_LENGTH = 256;
const DIGEST = "sha512";

function hash(password, salt = null, iterations = ITERATIONS, keyLength = KEY_LENGTH, digest = DIGEST) {
  if (salt) {
    return pbkdf2(password, salt, iterations, keyLength, digest).then((hashedPassword) => {
      return `${hashedPassword.toString("hex")}:${salt}:${iterations}:${keyLength}:${digest}`;
    });
  }
  return randomBytes(SALT_LENGTH).then((salt) => {
    return hash(password, salt.toString("hex"), iterations, keyLength, digest);
  });
}

function verify(password, hashedPassword) {
  const [, salt, iterations, keyLength, digest] = hashedPassword.split(":");
  return hash(password, salt, parseInt(iterations, 10), parseInt(keyLength, 10), digest).then((verifiedPassword) => {
    return verifiedPassword === hashedPassword;
  });
}

module.exports = {
  verify,
  hash
};
