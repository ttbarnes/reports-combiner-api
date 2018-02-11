// @flow
import rp from 'request-promise';
import crypto from 'crypto';
import { getKeys } from '../../utils/userExchangeKeys';
// import { formatResponse } from './utils';
import {
  BITFINEX_BASE_URL,
  BITFINEX_TRADES
} from '../../constants';

export const getBitfinexTradeHistory = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);

  const nonce = Date.now().toString();
  const completeURL = BITFINEX_BASE_URL + BITFINEX_TRADES;
  const body = {
    request: BITFINEX_TRADES,
    nonce
  };
  const payload = new Buffer(JSON.stringify(body))
    .toString('base64');

  const signature = crypto
    .createHmac('sha384', decryptedObj.secret)
    .update(payload)
    .digest('hex');

  const options = {
    url: completeURL,
    headers: {
      'X-BFX-APIKEY': decryptedObj.key,
      'X-BFX-PAYLOAD': payload,
      'X-BFX-SIGNATURE': signature
    },
    body: JSON.stringify(body),
    method: 'POST'
  };
  return rp(BITFINEX_BASE_URL + BITFINEX_TRADES, options, (error: any, response: any, body: any) => {
    console.log('body ', body); // getting ["error",10100,"apikey: invalid"]
  });
};
