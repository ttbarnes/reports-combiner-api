// @flow
import gdax from 'gdax';
import Cryptopia from 'cryptopia-api';
import { getKeys } from '../../utils/userExchangeKeys';
import { formatResponse } from './utils';
import { CRYPTOPIA_BASE_URL } from '../../constants';

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
