// @flow
import type { $Request, $Response } from 'express';
import User from '../models/user';
import { updateUser } from './user';
import {
  checkBinanceKeys,
  getBinanceTradeHistory
} from './exchanges/binance';
import {
  checkGdaxKeys,
  getGdaxTradeHistory
} from './exchanges/gdax';
import {
  checkCryptopiaKeys,
  getCryptopiaTradeHistory
} from './exchanges/cryptopia';
// import { getBitfinexTradeHistory } from './exchanges/bitfinex';
import { 
  EXCHANGE_NAME_BINANCE,
  EXCHANGE_NAME_BITFINEX,
  EXCHANGE_NAME_GDAX,
  EXCHANGE_NAME_CRYPTOPIA
} from '../constants';

export const userExchangeKeysValid = (exchange: Object): any => {
  return new Promise((resolve: any, reject: any): any => {
    if (exchange.name === EXCHANGE_NAME_BINANCE) {
      return checkBinanceKeys(exchange).then((binanceData: any): any => {
        return resolve(binanceData);
      }, (err: string): string => reject(err));
    }
    
    else if (exchange.name === EXCHANGE_NAME_GDAX) {
      return checkGdaxKeys(exchange).then((gdaxData: any): any => {
        return resolve(gdaxData);
      }, (err: string): string => reject(err));

    } else if (exchange.name === EXCHANGE_NAME_CRYPTOPIA) {
      return checkCryptopiaKeys(exchange).then((cryptopiaData: any): any => {
        return resolve(cryptopiaData);
      }, (err: string): string => reject(err));
    }
    return reject('Exchange not supported');
  });

};

type TempReqType = { body: any };
export const updateValidExchangeKeys = (req: TempReqType, res: $Response, newExchangeObj: Object): any  => {
  return new Promise((resolve: any, reject: any): Object => {
    return User.get(req.body.userId).then((usr: Object): any => {
      let updatedExchanges = [];
      if (usr.keys.length) {
        const exchangeExists = usr.keys.find((k: Object): boolean => k.name === newExchangeObj.name);

        usr.keys.map((k: Object, i: number): Array<Object> | Object => {
          const isLastItem = i === usr.keys.length - 1;
          if (exchangeExists) {
            updatedExchanges = [
              ...updatedExchanges,
              k
            ];
            return updatedExchanges;
          }
          if (!exchangeExists && isLastItem) {
            return userExchangeKeysValid(newExchangeObj).then((result: any): any => {
              updatedExchanges = [
                ...usr.keys,
                newExchangeObj
              ];
              usr.keys = updatedExchanges;
              return updateUser(req, res, usr);
            }, (err: string): any => {
                return res.status(400).send(err);
            });
          }
          return k;
        });
      } else {
        return userExchangeKeysValid(newExchangeObj).then((result: any): any => {
          usr.keys = [newExchangeObj];
          return updateUser(req, res, usr);
        }, (err: string): any =>
          res.status(400).send(err)
        );
      }
    });
  });
};

export const getExchangeTradeHistory = (exchange: any): Object => {
  return new Promise((resolve: any, reject: any): Object => {

    // bitfinex API issues at this moment in time
    // if (exchange.name === EXCHANGE_NAME_BITFINEX) {
    //   resolve(getBitfinexTradeHistory(exchange));
    // }
    if (exchange.name === EXCHANGE_NAME_BINANCE) {
      resolve(getBinanceTradeHistory(exchange));
    } else if (exchange.name === EXCHANGE_NAME_GDAX) {
      resolve(getGdaxTradeHistory(exchange));
    } else if (exchange.name === EXCHANGE_NAME_CRYPTOPIA) {
      resolve(getCryptopiaTradeHistory(exchange));
    }
    return reject(`Exchange ${exchange.name} is not supported`);
  });
};
