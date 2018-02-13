// @flow
import fs from 'fs';
import xlsx from 'node-xlsx';

import type { 
  SupportedExchangesType,
  InitExchangeObjType,
  InitExchangeObjRowsType,
  BinanceTradeHistoryFieldsType,
	BitfinexTradeHistoryFieldsType,
	GdaxAccountHistoryFieldsType,
	CryptopiaTradeHistoryFieldType,
  MasterTableFieldsType,
	MasterTableType,
} from '../index.types';

import { 
	isExchangeBinance,
	isExchangeBitfinex,
	isExchangeGdax,
	isExchangeCryptopia
} from './exchangeCheck';

import {
	getBinanceFieldValues,
	getBitfinexFieldValues,
	getGdaxFieldValues,
	getCryptopiaFieldValues
} from './exchangeFieldValues';

import {
	EXCHANGE_NAME_BINANCE,
	EXCHANGE_NAME_BITFINEX,
	EXCHANGE_NAME_GDAX,
	EXCHANGE_NAME_CRYPTOPIA
} from '../../constants';

const HISTORY_FILES_DIRECTORY = './history-files';
const ID_FIELD_NOT_FOUND = 5678;

/*
* parse and create new object structure from worksheet
* currently assuming only one 'sheet' per file
*/
const formatFirstWorksheet = (file: string): InitExchangeObjType => {
	const xlsxOptions = { raw: true };
	const parsedFile = xlsx.parse(`${HISTORY_FILES_DIRECTORY}/${file}`, xlsxOptions);
  const fileData = parsedFile[0].data;

  const headings = fileData.shift(); // headings are first item in array
  const rows = fileData;
  const initExchangeObj: InitExchangeObjType = {
    headings,
    rows
	};

	if (isExchangeBinance(headings)) {
		initExchangeObj.exchangeName = EXCHANGE_NAME_BINANCE;
	} else if (isExchangeBitfinex(headings)) {
		initExchangeObj.exchangeName = EXCHANGE_NAME_BITFINEX;
	} else if (isExchangeGdax(headings)) {
		initExchangeObj.exchangeName = EXCHANGE_NAME_GDAX;
	} else if (isExchangeCryptopia(headings)) {
		initExchangeObj.exchangeName = EXCHANGE_NAME_CRYPTOPIA;
	}
  return initExchangeObj;
};

/*
* read local files from HISTORY_FILES_DIRECTORY
* format & create combined masterTable
*/
export const createMasterTableFromLocalFiles = (): MasterTableType => {
	const combinedHistory: Array<InitExchangeObjType> = [];

	const masterTableHeadings: Array<MasterTableFieldsType> = [
		'Date',
		'Type',
		'Market',
		'Amount',
		'Price',
		'Fee',
		'Fee Currency',
		'Exchange'
	];
	const initRows: InitExchangeObjRowsType = [];
	const masterTable: MasterTableType = {
		headings: masterTableHeadings,
		rows: initRows
	};

	fs.readdirSync(HISTORY_FILES_DIRECTORY).map((file: string): InitExchangeObjRowsType | null => {
		if (file === '.DS_Store') return null;

    const newExchangeRows = formatExchangeRows(
      formatFirstWorksheet(file)
    );

		if (newExchangeRows && newExchangeRows.length) {
			masterTable.rows = [
				...masterTable.rows,
				...newExchangeRows
			];
    }
    return newExchangeRows;
	});
	return masterTable;
};


/*
* add each exchange's row of data to master table
* only use the fields we want
*/
const formatExchangeRows = (exchangeRow: InitExchangeObjType): InitExchangeObjRowsType  => {
	const newRows: Array<Array<string>> = [];
	const { rows } = exchangeRow;
	const headings: Array<string> = exchangeRow.headings;

	// TODO: better handle lower/uppercase instances
	const fieldDateIndex = headings.findIndex((h: string): boolean => (
		h === ('date') ||
		h === ('Date')
	));
	const fieldTimeIndex = headings.findIndex((h: string): boolean => (
		h === ('time') ||
		h === ('Time') ||
		h === ('Timestamp') ||
		h === ('timestamp')
	));
	const fieldFeeIndex = headings.findIndex((h: string): boolean => (
		h === ('fee') ||
		h === ('Fee')
	));
	const fieldAmountIndex = headings.findIndex((h: string): boolean => (
		h === ('amount') ||
		h === ('Amount')
	));
	const fieldPriceIndex = headings.findIndex((h: string): boolean => (
		h === ('price') ||
		h === ('Price')
	));

	const indexFound = (value: number): boolean => (value !== -1 && value !== ID_FIELD_NOT_FOUND);

	const dateOrTimeFieldIndex = (): number => {
		if ((fieldDateIndex && indexFound(fieldDateIndex)) ||
				fieldDateIndex === 0) {
			return fieldDateIndex;
		} else if ((fieldTimeIndex && indexFound(fieldTimeIndex)) ||
							fieldTimeIndex === 0) {
			return fieldTimeIndex;
		}
		return ID_FIELD_NOT_FOUND;
	};

	// set/format columns of a row
	rows.map((row: Array<string>): Array<string> => {
		let fieldDateValue: string = '',
				fieldFeeValue: string = '',
				fieldPriceValue: string = '';

		const fieldAmountValue: string = row[fieldAmountIndex];

		// handle AMOUNT
		const dateValueFound = indexFound(dateOrTimeFieldIndex());

		fieldDateValue = dateValueFound ? row[dateOrTimeFieldIndex()] : 'Unavailable';

		// handle FEE
		const feeValueFound = indexFound(fieldFeeIndex);
		fieldFeeValue = feeValueFound ? row[fieldFeeIndex] : 'Unavailable';

		// handle PRICE
		const priceValueFound = indexFound(fieldPriceIndex);
		fieldPriceValue = priceValueFound ? row[fieldPriceIndex] : 'Unavailable';

		// get values from exchange specific fields
		let exchangeValues = {};
		if (exchangeRow.exchangeName === EXCHANGE_NAME_BINANCE) {
			exchangeValues = getBinanceFieldValues(headings, row);
		} else if (exchangeRow.exchangeName === EXCHANGE_NAME_BITFINEX) {
			exchangeValues = getBitfinexFieldValues(headings, row);
		} else if (exchangeRow.exchangeName === EXCHANGE_NAME_GDAX) {
			exchangeValues = getGdaxFieldValues(headings, row);
		}
		else if (exchangeRow.exchangeName === EXCHANGE_NAME_CRYPTOPIA) {
			exchangeValues = getCryptopiaFieldValues(headings, row);
		}

		// TODO: test ordering of fields
		const masterTableRow = [
			fieldDateValue,
			exchangeValues.type,
			exchangeValues.market,
			fieldAmountValue,
			exchangeValues.price || fieldPriceValue,
			fieldFeeValue,
			exchangeValues.feeCurrency,
			exchangeRow.exchangeName || ''
		];
		
		newRows.push(masterTableRow);
		return masterTableRow;
	});

	return newRows;
};

