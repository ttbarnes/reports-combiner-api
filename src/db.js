// @flow
/* eslint-disable */
require('dotenv').config();
import mongoose from 'mongoose';
Promise = require('bluebird'); // eslint-disable-line
mongoose.Promise = Promise; // eslint-disable-line

const dbUsername = process.env.DB_USERNAME || '';
const dbPass = process.env.DB_PASS || '';
const dbUrl = process.env.DB_URL || '';
const DB_URL = `mongodb://${dbUsername}:${dbPass}@${dbUrl}`;

const callback = (callback: Function) => {
  mongoose.connect(DB_URL, {
    server: { socketOptions: { keepAlive: 1 } }
  });
  mongoose.connection.on('error', () => {
    throw new Error('Unable to connect to database.');
  });
  callback();
};

export default callback;

/* eslint-enable */
