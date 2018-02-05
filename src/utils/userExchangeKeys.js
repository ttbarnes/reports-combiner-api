/* eslint-disable */
import crypto from 'crypto';

const HMAC_ALGORITHM = 'SHA256';
const HMAC_KEY = crypto.randomBytes(32); // This key should be stored in an environment variable

const ALGORITHM = 'aes-256-ctr';
const PASS = process.env.KEYS_ENCRYPT_SECRET;;
// const IV = '60iP0h6vJoEa';

export const decrypt = (text) => {
  let decipher = crypto.createDecipher(ALGORITHM, PASS);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

export const encrypt = (text) => {
  let cipher = crypto.createCipher(ALGORITHM, PASS);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/* eslint-enable */
