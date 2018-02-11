// @flow
import { getBinanceTradeHistory } from './exchanges/binance';
import { getGdaxTradeHistory } from './exchanges/gdax';
import { getCryptopiaTradeHistory} from './exchanges/cryptopia';
// import { getBitfinexTradeHistory } from './exchanges/bitfinex';

export const getExchangeData = (exchange: any): Object => {
  return new Promise((resolve: any, reject: any): Object => {

    // bitfinex API issues at this moment in time
    // if (exchange.name === 'Bitfinex') {
    //   resolve(getBitfinexTradeHistory(exchange));
    // }

    if (exchange.name === 'Binance') {
      resolve(getBinanceTradeHistory(exchange));
    } else if (exchange.name === 'GDAX') {
      resolve(getGdaxTradeHistory(exchange));
    } else if (exchange.name === 'Cryptopia') {
      resolve(getCryptopiaTradeHistory(exchange));
    }
    return reject('error :(');

  });
};
