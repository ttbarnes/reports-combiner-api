// @flow
import rp from 'request-promise';
import crypto from 'crypto';
import binance from 'node-binance-api';
import gdax from 'gdax';
import Cryptopia from 'cryptopia-api';
import { getKeys } from '../utils/userExchangeKeys';
import {
  BITFINEX_BASE_URL,
  BITFINEX_TRADES,
  GDAX_BASE_URL,
  CRYPTOPIA_BASE_URL
} from '../constants';

const formatResponse = (name: string, data: Object): Object => {
  return {
    name,
    data
  };
};

/*
export const getBitfinex = (exchange: Object): Object => {
  const queryKey = decrypt(exchange.key);
  const querySecret = decrypt(exchange.secret);

  const nonce = Date.now().toString();
  const completeURL = BITFINEX_BASE_URL + BITFINEX_TRADES;
  const body = {
    request: BITFINEX_TRADES,
    nonce
  };
  const payload = new Buffer(JSON.stringify(body))
    .toString('base64');

  const signature = crypto
    .createHmac('sha384', querySecret)
    .update(payload)
    .digest('hex');

  const options = {
    url: completeURL,
    headers: {
      'X-BFX-APIKEY': queryKey,
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
*/

export const getGdax = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);

  const authedClient = new gdax.AuthenticatedClient(
    decryptedObj.key,
    decryptedObj.secret,
    decryptedObj.passphrase,
    GDAX_BASE_URL
  );

  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return authedClient.getProductTrades('BTC-USD').then((data: any): Promise<Object> => {
      return resolve(
        formatResponse(exchange.name, data)
      );
    });
  });
};

export const getBinance = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);

  binance.options({
    APIKEY: decryptedObj.key,
    APISECRET: decryptedObj.secret,
    test: true // sandbox mode where orders are simulated
  });
  
  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return binance.trades('REQBTC', (err: any, data: Object, symbol: any): Promise<Object> => {
      if (err) reject({ binanceError: true });
      return resolve(
        formatResponse(exchange.name, data)
      );
    });
  });
};

export const getCryptopia = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);

  const options = {
    API_KEY: decryptedObj.key,
    API_SECRET: decryptedObj.secret,
    HOST_URL: CRYPTOPIA_BASE_URL
  };
 
  const cryptopia = Cryptopia();
  cryptopia.setOptions(options);

  return new Promise((resolve: any, reject: any): any => {
    return cryptopia.getTradeHistory({ Market: 'PND/BTC' }).then((data: any): any => {
      return resolve(
        formatResponse(exchange.name, data.Data)
      );
    });
  });
};

export const getExchangeData = (exchange: any): Object => {
  return new Promise((resolve: any, reject: any): Object => {

    // bitfinex API issues at this moment in time
    // if (exchange.name === 'Bitfinex') {
    //   resolve(getBitfinex(exchange));
    // }

    if (exchange.name === 'Binance') {
      resolve(getBinance(exchange));
    } else if (exchange.name === 'GDAX') {
      resolve(getGdax(exchange));
    } else if (exchange.name === 'Cryptopia') {
      resolve(getCryptopia(exchange));
    }
    return reject('error :(');

  });
};
