// @flow
export type ExchangeNamesType = 'Binance' | 'Bitfinex' | 'GDAX' | 'Cryptopia';

export type BinanceTradeHistoryType = {
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

export type CryptopiaTradeHistoryType = {
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

export type GdaxTradeHistoryType = {};

export type InitExchangeType = {
  name: ExchangeNamesType,
  data: Array<BinanceTradeHistoryType | CryptopiaTradeHistoryType>
};

export type InitAllExchangesType = Array<InitExchangeType>;

export type MasterHistoryFieldsType = 'Price' | 'Timestamp' | 'Amount' | 'Fee' | 'Type' | 'Exchange' | 'Notes';

export type MasterHistoryExchangeDataType = {
  price: string | number,
  timestamp: string | number,
  amount: string | number,
  fee: string | number,
  tradeType: string,
  exchangeName: string
};

export type MasterHistoryExchangeDataFieldNamesType = 'price' | 'timestamp' | 'amount' | 'fee' | 'tradeType' | 'exchangeName' | 'note';

export type MasterHistoryType = {
  fields: Array<MasterHistoryFieldsType>,
  trades: Array<MasterHistoryExchangeDataType>
};
