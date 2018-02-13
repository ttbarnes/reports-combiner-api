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
    return authedClient.getAccounts().then((data: any): Promise<Object> => {
      // example: trade history for one account
      // const accountExample = data.find((d: Object): boolean => d.currency === 'BTC');
      // return authedClient.getAccountHistory(accountExample.id).then((result: any): void => {
      //   return resolve(
      //     formatResponse(exchange.name, data)
      //   );
      // });
      return resolve(
        formatResponse(exchange.name, data)
      );
    });
  });
};
