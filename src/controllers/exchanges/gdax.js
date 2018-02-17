// @flow
import gdax from 'gdax';
import { getKeys } from '../../utils/userExchangeKeys';
import { formatResponse } from './utils';
import { GDAX_BASE_URL } from '../../constants';

const createGdaxAuthedClient = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);
  const authedClient = new gdax.AuthenticatedClient(
    decryptedObj.key,
    decryptedObj.secret,
    decryptedObj.passphrase,
    GDAX_BASE_URL
  );
  return authedClient;
};

export const checkGdaxKeys = (exchange: Object): Object => {
  const authedClient = createGdaxAuthedClient(exchange);

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

/*
* getGdaxAccountsTrades
* with a list of accounts, get all account history for each account
* merge and return all account's trades into one array
*/
const getGdaxAccountsTrades = (authedClient: Object, accounts: Array<Object>): Promise<Array<Object>> => {
  let allAccountTrades = [];
  const accountsLength = accounts.length;
  return new Promise((resolve: any, reject: any): Array<Object> => {
    return accounts.map((account: Object, index: number): Promise<Object> => {

      const isLast = index === accountsLength - 1;
      return authedClient.getAccountHistory(account.id).then((accountHistory: Array<Object>): Array<Object> | Promise<Object> => {
        if (accountHistory.length) {
          accountHistory.map((h: Object): string => h.currency = account.currency);

          allAccountTrades = [
            ...allAccountTrades,
            ...accountHistory
          ];
        }
        if (isLast) {
          return resolve(allAccountTrades);
        }
        return accountHistory;
      });
    });

  });
};

/*
* getGdaxTradeHistory
* get list of 'accounts' from GDAX (returns eg, BTC account, EUR account, USD account etc)
* from this list of accounts, get all account history for each account
*/
export const getGdaxTradeHistory = (exchange: Object): Object => {
  const authedClient = createGdaxAuthedClient(exchange);

  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return authedClient.getAccounts().then((accounts: Array<Object>): Promise<Object> => {
      return getGdaxAccountsTrades(authedClient, accounts).then((allAccountsTrades: Array<Object>): Promise<Object> => {
        return resolve(
          formatResponse(exchange.name, allAccountsTrades)
        );
      });
    });
  });
};
