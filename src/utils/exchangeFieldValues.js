// @flow
import type {
  BinanceTradeHistoryFieldsType,
  BitfinexTradeHistoryFieldsType,
  GdaxAccountHistoryFieldsType
} from './index.types';

const BINANCE_FIELD_MARKET_NAME: BinanceTradeHistoryFieldsType = 'Market';
const BITFINEX_FIELD_MARKET_NAME: BitfinexTradeHistoryFieldsType = 'Pair';
const GDAX_FIELD_MARKET_NAME: GdaxAccountHistoryFieldsType = 'amount/balance unit';

const BINANCE_FIELD_FEE_CURRENCY_NAME: BinanceTradeHistoryFieldsType = 'Fee Coin';
const BITFINEX_FIELD_FEE_CURRENCY_NAME: BitfinexTradeHistoryFieldsType = 'FeeCurrency';

const BINANCE_FIELD_TYPE_NAME: BinanceTradeHistoryFieldsType= 'Type';
const GDAX_FIELD_TYPE_NAME: GdaxAccountHistoryFieldsType = 'type';


/*
* get Binance specific field values, add to new fieldValues object
* EG: fieldValues.feeCurrency === 'Fee Coin'
*/
export const getBinanceFieldValues = (headings: Array<string>, row: Array<string>): Object => {
  let fieldValues = {};

  const fieldMarketIndex = headings.findIndex((h: string): boolean => h === BINANCE_FIELD_MARKET_NAME);
  const fieldMarketValue = row[fieldMarketIndex];
  fieldValues.market = fieldMarketValue;

  const fieldCurrencyFeeIndex = headings.findIndex((h: string): boolean => h === BINANCE_FIELD_FEE_CURRENCY_NAME);
  const fieldCurrencyFeeValue = row[fieldCurrencyFeeIndex];
  fieldValues.feeCurrency = fieldCurrencyFeeValue;

  const fieldTypeIndex = headings.findIndex((h: string): boolean => h === BINANCE_FIELD_TYPE_NAME);
  const fieldTypeValue = row[fieldTypeIndex];
  fieldValues.type = fieldTypeValue;

  return fieldValues;
};

/*
* get Bitfinex specific field values, add to new fieldValues object
* EG: fieldValues.feeCurrency === 'FeeCurrency'
*/
export const getBitfinexFieldValues = (headings: Array<string>, row: Array<string>): Object => {
  let fieldValues = {};
  const fieldMarketIndex = headings.findIndex((h: string): boolean => h === BITFINEX_FIELD_MARKET_NAME);
  const fieldMarketValue = row[fieldMarketIndex];
  fieldValues.market = fieldMarketValue;

  fieldValues.type = 'BUY';

  const fieldCurrencyFeeIndex = headings.findIndex((h: string): boolean => h === BITFINEX_FIELD_FEE_CURRENCY_NAME);
  const fieldCurrencyFeeValue = row[fieldCurrencyFeeIndex];
  fieldValues.feeCurrency = fieldCurrencyFeeValue;

  return fieldValues;
};

/*
* get GDAX specific field values, add to new fieldValues object
* EG: fieldValues.feeCurrency === 'gdaxField'
*/
export const getGdaxFieldValues = (headings: Array<string>, row: Array<string>): Object => {
  let fieldValues = {};
  const fieldMarketIndex = headings.findIndex((h: string): boolean => h === GDAX_FIELD_MARKET_NAME);
  const fieldMarketValue = row[fieldMarketIndex];
  fieldValues.market = fieldMarketValue;

  fieldValues.feeCurrency = 'Unavailable';

  const fieldTypeIndex = headings.findIndex((h: string): boolean => h === GDAX_FIELD_TYPE_NAME);
  const fieldTypeValue = row[fieldTypeIndex];
  fieldValues.type = fieldTypeValue;

  return fieldValues;
};
