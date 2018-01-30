// @flow
export type SupportedExchangesType = 'binance' | 'bitfinex' | 'gdax' | 'gdax';

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
	'Fee Coin';
 
export type BitfinexTradeHistoryFieldsType =
	'#' |
	'Pair' |
	'Amount' |
	'Price' |
	'Fee' |
	'FeeCurrency' |
	'Date';

export type MasterTableFieldsType = 'Time' | 'time' | 'Date' | 'date' | 'Amount' | 'amount' | 'Fee' | 'fee' | 'Exchange';

export type MasterTableType = {
	headings: Array<MasterTableFieldsType>;
	rows: Array<Array<string>>
};

export type ExchangeTradeHistoryHeadingsType = BinanceTradeHistoryFieldsType | BitfinexTradeHistoryFieldsType;
export type TradeHistoryHeadingType = Array<ExchangeTradeHistoryHeadingsType>;
