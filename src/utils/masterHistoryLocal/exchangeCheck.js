// @flow
import type {
  BinanceTradeHistoryFieldsType,
  BitfinexTradeHistoryFieldsType,
  GdaxAccountHistoryFieldsType,
  CryptopiaTradeHistoryFieldType
} from '../index.types';


type ExchangeHeadingsType = {
  binance: Array<BinanceTradeHistoryFieldsType>,
  bitfinex: Array<BitfinexTradeHistoryFieldsType>,
  gdax: Array<GdaxAccountHistoryFieldsType>,
  cryptopia: Array<CryptopiaTradeHistoryFieldType>
};

const expectedExchangeHeadings: ExchangeHeadingsType = {
  binance: ['Date', 'Market', 'Type', 'Price', 'Amount', 'Total', 'Fee', 'Fee Coin'],
  bitfinex: ['#', 'Pair', 'Amount', 'Price', 'Fee', 'FeeCurrency', 'Date'],
  gdax: ['type', 'time', 'amount', 'balance', 'amount/balance unit', 'transfer id', 'trade id', 'order id'],
  cryptopia: ['#', 'Market', 'Type', 'Rate', 'Amount', 'Total', 'Fee', 'Timestamp']
};

const arraysMatch = (
  a: Array<string>,
  b: Array<BinanceTradeHistoryFieldsType> |
    Array<BitfinexTradeHistoryFieldsType> |
    Array<GdaxAccountHistoryFieldsType> |
    Array<CryptopiaTradeHistoryFieldType>
): boolean => {
  return !a.some((e: string, i: number): boolean => {
    return e != b[i];
  });
};

export const isExchangeBinance = (arr: Array<string>): boolean => {
  return arraysMatch(arr, expectedExchangeHeadings.binance);
};

export const isExchangeBitfinex = (arr: Array<string>): boolean => {
  return arraysMatch(arr, expectedExchangeHeadings.bitfinex);
};

export const isExchangeGdax = (arr: Array<string>): boolean => {
  return arraysMatch(arr, expectedExchangeHeadings.gdax);
};

export const isExchangeCryptopia = (arr: Array<string>): boolean => {
  return arraysMatch(arr, expectedExchangeHeadings.cryptopia);
};
