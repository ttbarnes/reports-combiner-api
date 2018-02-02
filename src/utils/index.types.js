// @flow
export type SupportedExchangesType = 'binance' | 'bitfinex' | 'gdax' | 'cryptopia';

export type InitExchangeObjRowsType = Array<Array<string>>;

export type InitExchangeObjType = {
	headings: Array<string>,
	rows: InitExchangeObjRowsType,
	exchangeName?: SupportedExchangesType
};

export type BinanceTradeHistoryFieldsType = 
	'Date' | 
	'Market' |
	'Type' |
	'Price' |
	'Amount' |
	'Total' |
	'Fee' |
	'Fee Coin'
;
 
export type BitfinexTradeHistoryFieldsType =
	'#' |
	'Pair' |
	'Amount' |
	'Price' |
	'Fee' |
	'FeeCurrency' |
	'Date'
;

export type GdaxAccountHistoryFieldsType = 
	'type' |
	'time' |
	'amount' | 
	'balance' |
	'amount/balance unit' | 
	'transfer id' | 
	'trade id' | 
	'order id'
;

export type CryptopiaTradeHistoryFieldType =
	'#' |
	'Market' |
	'Type' |
	'Rate' |
	'Amount' |
	'Total' | 
	'Fee' |
	'Timestamp'
;

export type MasterTableFieldsType =
	'Date' |
	'Type' |
	'Market' |
	'Amount' | // amount of coins bought
	'Price' | // price per coin
	'Fee' |
	'Fee Currency' |
	'Exchange'
;

export type MasterTableType = {
	headings: Array<MasterTableFieldsType>;
	rows: Array<Array<string>>
};

export type ExchangeTradeHistoryHeadingsType = BinanceTradeHistoryFieldsType | BitfinexTradeHistoryFieldsType;
export type TradeHistoryHeadingType = Array<ExchangeTradeHistoryHeadingsType>;
