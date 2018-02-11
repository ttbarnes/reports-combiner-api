/* eslint-disable */
import crypto from 'crypto';

const HMAC_ALGORITHM = 'SHA256';
const HMAC_KEY = crypto.randomBytes(32); // This key should be stored in an environment variable

const ALGORITHM = 'aes-256-ctr';
const PASS = process.env.KEYS_ENCRYPT_SECRET;;
// const IV = '60iP0h6vJoEa';

export const decrypt = (str) => {
  if (!str) return null;
  let decipher = crypto.createDecipher(ALGORITHM, PASS);
  let dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

export const encrypt = (str) => {
  if (!str) return null;
  let cipher = crypto.createCipher(ALGORITHM, PASS);
  let crypted = cipher.update(str, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export const getKeys = (exchange: Object): Object => {
  let obj = {};
  obj = {
    key: decrypt(exchange.key),
    secret: decrypt(exchange.secret),
    passphrase: decrypt(exchange.passphrase)
  };
  return obj;
};

/* eslint-enable */
