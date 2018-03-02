// @flow
import binance from 'node-binance-api';
import { getKeys } from '../../utils/userExchangeKeys';
import { formatResponse } from './utils';

export const checkBinanceKeys = (exchange: Object): Promise<Object> => {
  const decryptedObj = getKeys(exchange);

  binance.options({
    APIKEY: decryptedObj.key,
    APISECRET: decryptedObj.secret,
    test: true // sandbox mode where orders are simulated
  });

  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return binance.account((err: Object, data: Object, symbol: string): any => {
      if (err) {
        return reject({ errorMessage: 'Invalid code, or issue with Binance' });
      } else if (data) {
        return resolve(data);
      }
    });
  });
};

const getBinanceAccountBalanceSymbols = (): Promise<Array<string>> => {
  const assetSymbolsWithBalance = [];
  return new Promise((resolve: any, reject: any): Promise<Array<string>> =>
    
    binance.account((err: Object, account: Object, symbol: string): Promise<Function> => {
      account.balances.map((asset: Object): Object => {
        if (asset.free > 0) {
          assetSymbolsWithBalance.push(asset.asset);
        }
        return asset;
      });
      return resolve(assetSymbolsWithBalance);
    })
  );
};

const getBinanceTradesFromSymbol = (symbol: string): Promise<Array<Object>> => {
  return new Promise((resolve: any, reject: any): Promise<Array<Object>> => {
    return binance.trades(symbol, (err: Object, data: Array<Object>, symbol: string): Promise<Array<Object>> =>
      resolve(data)
    );
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
    // currently with binance, doesn't seem possible to get a list of symbols/markets for a user
    // for V1 we can get trades purely from accounts that have balances
    // for now we also hard code into BTC pair. Need to have an approach/solution that will account for BTC, ETH, others.

    const binanceTrades = [];

    const onComplete = (): Promise<Object> => resolve(
      formatResponse(exchange.name, binanceTrades)
    );

    return getBinanceAccountBalanceSymbols().then((balanceSymbols: Array<string>): any => {
      let balanceSymbolsCount = balanceSymbols.length;

      if (balanceSymbolsCount === 0) {
        return onComplete();
      } else {
        balanceSymbols.forEach((symbol: string): any => {
          getBinanceTradesFromSymbol(`${symbol}BTC`).then((results: any): any => {
            binanceTrades.push(...results);
            if (--balanceSymbolsCount === 0) {
              return onComplete();
            }
          });
        });
      }
    }, (err: any): Promise<Object> => {
      return reject({ error: err });
    });

  });
};
