// @flow
import { getBinanceTradeHistory } from './exchanges/binance';
import { getGdaxTradeHistory } from './exchanges/gdax';
import { getCryptopiaTradeHistory} from './exchanges/cryptopia';
// import { getBitfinexTradeHistory } from './exchanges/bitfinex';
import { 
  EXCHANGE_NAME_BINANCE,
  EXCHANGE_NAME_BITFINEX,
  EXCHANGE_NAME_GDAX,
  EXCHANGE_NAME_CRYPTOPIA
} from '../constants';

export const getExchangeData = (exchange: any): Object => {
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
    return reject('error :(');

  });
};
