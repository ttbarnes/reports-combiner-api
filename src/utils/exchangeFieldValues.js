// @flow
import type {
  BinanceTradeHistoryFieldsType,
  BitfinexTradeHistoryFieldsType,
  GdaxAccountHistoryFieldsType,
  CryptopiaTradeHistoryFieldType
} from './index.types';

// master table field names VS exchange field names
// eg: EXCHANGE_FIELD_XYZ_NAME = 'different field named the exchange uses';

// field: market
const BINANCE_FIELD_MARKET_NAME: BinanceTradeHistoryFieldsType = 'Market';
const BITFINEX_FIELD_MARKET_NAME: BitfinexTradeHistoryFieldsType = 'Pair';
const GDAX_FIELD_MARKET_NAME: GdaxAccountHistoryFieldsType = 'amount/balance unit';
const CRYPTOPIA_FIELD_MARKET_NAME: CryptopiaTradeHistoryFieldType = 'Market';

// field: currency
const BINANCE_FIELD_FEE_CURRENCY_NAME: BinanceTradeHistoryFieldsType = 'Fee Coin';
const BITFINEX_FIELD_FEE_CURRENCY_NAME: BitfinexTradeHistoryFieldsType = 'FeeCurrency';

// field: type
const BINANCE_FIELD_TYPE_NAME: BinanceTradeHistoryFieldsType= 'Type';
const GDAX_FIELD_TYPE_NAME: GdaxAccountHistoryFieldsType = 'type';
const CRYPTOPIA_FIELD_TYPE_NAME: CryptopiaTradeHistoryFieldType = 'Type';

// field: price
const CRYPTOPIA_FIELD_PRICE_NAME: CryptopiaTradeHistoryFieldType = 'Rate';


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


/*
* get Cryptopia specific field values, add to new fieldValues object
* EG: fieldValues.feeCurrency === 'cryptopiaField'
*/
export const getCryptopiaFieldValues = (headings: Array<string>, row: Array<string>): Object => {
  let fieldValues = {};
  const fieldMarketIndex = headings.findIndex((h: string): boolean => h === CRYPTOPIA_FIELD_MARKET_NAME);
  const fieldMarketValue = row[fieldMarketIndex];
  fieldValues.market = fieldMarketValue;


  const fieldPriceIndex = headings.findIndex((h: string): boolean => h === CRYPTOPIA_FIELD_PRICE_NAME);
  const fieldPriceValue = row[fieldPriceIndex];
  fieldValues.price = fieldPriceValue;

  fieldValues.feeCurrency = 'BTC'; // assuming this for now with the data we have
  
  const fieldTypeIndex = headings.findIndex((h: string): boolean => h === CRYPTOPIA_FIELD_TYPE_NAME);
  const fieldTypeValue = row[fieldTypeIndex];
  fieldValues.type = fieldTypeValue;
  
  
  return fieldValues;
};


// CryptopiaTradeHistoryFieldType
