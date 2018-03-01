// @flow
import type {
  ExchangeNamesType,
  BinanceTradeHistoryType,
  CryptopiaTradeHistoryType,
  GdaxTradeHistoryType,
  InitExchangeType,
  InitAllExchangesType,
  MasterHistoryFieldsType,
  MasterHistoryExchangeDataType,
  MasterHistoryExchangeDataFieldNamesType,
  MasterHistoryType
} from './masterHistory.types';

/*
* base object for MasterHistoryExchangeDataType
*/
const baseMasterHistoryExchangeData = {
  note: ''
};

/*
* map Cryptopia specific field values to new field name, for MasterHistoryExchangeDataType
* EG: item.feeCurrency === 'cryptopiaFieldName'
*/
const mergeCryptopiaTradeFields = (exchange: InitExchangeType): Array<MasterHistoryExchangeDataType> => {
  let newArr = [];
  exchange.data.map((trade: Object) => {
    let newObj = {
      price: trade.Rate.toString(),
      timestamp: trade.TimeStamp,
      amount: trade.Amount.toString(),
      fee: trade.Fee.toString(),
      tradeType: trade.Type,
      exchangeName: exchange.name,
      ...baseMasterHistoryExchangeData
    };
    newArr.push(newObj);
  });

  return newArr;
};

/*
* mergeBinanceTradeFields
*
* map Binance specific field values to new field name, for MasterHistoryFields
* EG: item.feeCurrency === 'binanceFieldName'
*/
const mergeBinanceTradeFields = (exchange: InitExchangeType): Array<MasterHistoryExchangeDataType> => {
  let newArr = [];

  exchange.data.map((trade: Object) => {
    let newObj = {
      price: trade.price.toString(),
      timestamp: trade.time.toString(),
      amount: trade.qty.toString(),
      fee: trade.commission.toString(),
      tradeType: trade.isBuyer ? 'Buy' : 'Sell',
      exchangeName: exchange.name,
      ...baseMasterHistoryExchangeData
    };
    newArr.push(newObj);
  });
  return newArr;
};

/*
* map GDAX specific field values to new field name, for MasterHistoryFields
* EG: item.feeCurrency === 'gdaxFieldName'
*/
const mergeGdaxTradeFields = (exchange: InitExchangeType): Array<MasterHistoryExchangeDataType> => {
  let newArr = [];
  exchange.data.map((trade: Object) => {
    let newObj = {
      price: 'N/A',
      timestamp: trade.created_at.toString(),
      amount: trade.amount.toString(),
      fee: 'N/A',
      tradeType: trade.type,
      exchangeName: exchange.name,
      ...baseMasterHistoryExchangeData
    };
    newArr.push(newObj);
  });
  return newArr;
};

/*
* mergeTradeFieldsHandler
*
* check exchange name and call appropriate mergeTradeFields function
*/
const mergeTradeFieldsHandler = (exchange: InitExchangeType): Array<MasterHistoryExchangeDataType> => {
  if (exchange.name === 'Binance') {
    return mergeBinanceTradeFields(exchange);
  } else if (exchange.name === 'Cryptopia') {
    return mergeCryptopiaTradeFields(exchange);
  } else if (exchange.name === 'GDAX') {
    return mergeGdaxTradeFields(exchange);
  }
  return [];
};

/*
* createMasterHistory
*
* with an Array of exchange's trade history...
* merge/reformat trade fields, sort into one single array
* return clean trade history in master history format, also a fields array
*/
const createMasterHistory = (exchanges: InitAllExchangesType): MasterHistoryType => {
  let trades = [];
  exchanges.map((exchange: Object): InitExchangeType => {
    if (exchange.name === 'Binance' ||
        exchange.name === 'Cryptopia' ||
        exchange.name === 'GDAX') {
      const tidyExchangeData = mergeTradeFieldsHandler(exchange);
      trades = [ ...trades, ...tidyExchangeData ];
    }
    return exchange;
  });

  return {
    fields: [
      'Price', 'Timestamp', 'Amount', 'Fee', 'Type', 'Exchange', 'Notes'
    ],
    trades: trades
  };
};

export default createMasterHistory;
