// @flow
import gdax from 'gdax';
// $FlowFixMe
import Cryptopia from 'cryptopia-api';
import { getKeys } from '../../utils/userExchangeKeys';
import { formatResponse } from './utils';
import { CRYPTOPIA_BASE_URL } from '../../constants';

export const checkCryptopiaKeys = (exchange: Object): Object => {
  const decryptedObj = getKeys(exchange);
  const options = {
    API_KEY: decryptedObj.key,
    API_SECRET: decryptedObj.secret,
    HOST_URL: CRYPTOPIA_BASE_URL
  };

  const cryptopia = Cryptopia();
  cryptopia.setOptions(options);

  return new Promise((resolve: any, reject: any): any => {
    return cryptopia.getBalance().then((data: any): any => {
      if (data && data.Success === true) {
        return resolve(data); 
      }
      return reject({
        errorMessage: 'Invalid code, or issue with Cryptopia'
      });
    }).catch((err: any): Promise<Object> => {
      return reject({
        errorMessage: 'Invalid code, or issue with Cryptopia'
      });
    });
  });

};


export const getCryptopiaTradeHistory = (exchange: Object): Object => {
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
