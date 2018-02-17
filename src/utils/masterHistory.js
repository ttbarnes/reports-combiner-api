// @flow
type ExchangeNamesType = 'Binance' | 'Bitfinex' | 'GDAX' | 'Cryptopia';

type BinanceTradeHistoryType = {
  id: number,
  orderId: number,
  price: string,
  qty: string,
  commission: string,
  commissionAsset: string,
  time: number,
  isBuyer?: boolean,
  isMaker?: boolean,
  isBestMatch?: boolean
};

type CryptopiaTradeHistoryType = {
  TradeId: number,
  TradePairId: number,
  Market: string,
  Type: string,
  Rate: number,
  Amount: number,
  Total: number,
  Fee: number,
  TimeStamp: string
};

type GdaxTradeHistoryType = {};


type InitExchangeType = {
  name: ExchangeNamesType,
  data: Array<BinanceTradeHistoryType | CryptopiaTradeHistoryType>
};

type InitAllExchangesType = Array<InitExchangeType>;

type MasterHistoryFieldsType = 'Price' | 'Timestamp' | 'Amount' | 'Fee' | 'Type' | 'Exchange' | 'Notes';

type MasterHistoryExchangeDataType = {
  price: string | number,
  timestamp: string | number,
  amount: string | number,
  fee: string | number,
  type: string,
  exchangeName: string
};

type MasterHistoryType = {
  fields: Array<MasterHistoryFieldsType>,
  trades: Array<MasterHistoryExchangeDataType>
};

/*
* base object for MasterHistoryExchangeDataType
*/
const baseMasterHistoryExchangeData = {
  uiAddNote: true
};

/*
* map Cryptopia specific field values to new field name, for MasterHistoryExchangeDataType
* EG: item.feeCurrency === 'cryptopiaFieldName'
*/
const mergeCryptopiaTradeFields = (exchange: InitExchangeType): Array<MasterHistoryExchangeDataType> => {
  let newArr = [];
  exchange.data.map((trade: Object) => {
    let newObj = {
      price: trade.Rate,
      timestamp: trade.TimeStamp,
      amount: trade.Amount,
      fee: trade.Fee,
      type: trade.Type,
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
      price: trade.price,
      timestamp: trade.time,
      amount: trade.qty,
      fee: trade.commission,
      type: trade.isBuyer ? 'Buy' : 'Sell',
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
      timestamp: trade.created_at,
      amount: trade.amount,
      fee: 'N/A',
      type: trade.type,
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

// currently we will do filtering/sorting client side
const sortMasterHistoryList = (masterHistory: Array<MasterHistoryExchangeDataType>): Array<MasterHistoryExchangeDataType> =>
  masterHistory;
  // masterHistory.sort((a: any, b: any): any => {
  //   return new Date(a[0]).getTime() - new Date(b[0]).getTime();
  // });

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
    // just using these 2 exchanges for init dev
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
    trades: sortMasterHistoryList(trades)
  };
};

export default createMasterHistory;
