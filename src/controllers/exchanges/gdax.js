// @flow
import gdax from 'gdax';
import { getKeys } from '../../utils/userExchangeKeys';
import { formatResponse } from './utils';
import { GDAX_BASE_URL } from '../../constants';

export const checkGdaxKeys = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);
  const authedClient = new gdax.AuthenticatedClient(
    decryptedObj.key,
    decryptedObj.secret,
    decryptedObj.passphrase,
    GDAX_BASE_URL
  );

  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return authedClient.getCoinbaseAccounts().then((data: any): Promise<Object> => {
      if (data.message && data.message.includes('Invalid')) {
        return reject({
          errorMessage: 'Invalid code, or issue with GDAX'
        });
      }
      return resolve(data);
    });
  });
};

export const getGdaxTradeHistory = (exchange: Object): Object => {
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
