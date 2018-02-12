// @flow
import binance from 'node-binance-api';
import { getKeys } from '../../utils/userExchangeKeys';
import { formatResponse } from './utils';

export const checkBinanceKeys = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);

  binance.options({
    APIKEY: decryptedObj.key,
    APISECRET: decryptedObj.secret,
    test: true // sandbox mode where orders are simulated
  });

  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return binance.account((err: any, data: Object, symbol: any): any => {
      if (err) {
        return reject({ errorMessage: 'Invalid code, or issue with Binance' });
      } else if (data) {
        return resolve(data);
      }
    });
  });
};

export const getBinanceTradeHistory = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);

  binance.options({
    APIKEY: decryptedObj.key,
    APISECRET: decryptedObj.secret,
    test: true // sandbox mode where orders are simulated
  });

  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return binance.trades('REQBTC', (err: any, data: Object, symbol: any): Promise<Object> => {
      if (err) return reject({ binanceError: true });
      return resolve(
        formatResponse(exchange.name, data)
      );
    });
  });
};
