// @flow
import fs from 'fs';
import xlsx from 'node-xlsx';

import type { 
  SupportedExchangesType,
  InitExchangeObjType,
  InitExchangeObjRowsType,
  BinanceTradeHistoryFieldsType,
  BitfinexTradeHistoryFieldsType,
  MasterTableFieldsType,
  MasterTableType
} from './index.types';

const HISTORY_FILES_DIRECTORY = './history-files';
const ID_FIELD_NOT_FOUND = 5678;

const isExchangeBinance = (str: string): boolean => str.includes(('binance': SupportedExchangesType));
const isExchangeBitfinex = (str: string): boolean => str.includes(('bitfinex': SupportedExchangesType));
const isExchangeGdax = (str: string): boolean => str.includes(('gdax': SupportedExchangesType));


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

  if (isExchangeBinance(file)) {
    initExchangeObj.exchangeName = 'binance';
  } else if (isExchangeBitfinex(file)) {
    initExchangeObj.exchangeName = 'bitfinex';
	} else if (isExchangeGdax(file)) {
		initExchangeObj.exchangeName = 'gdax';
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
		'Amount',
		'Fee',
		'Exchange'
	];
	const initRows: InitExchangeObjRowsType = [];
	const masterTable: MasterTableType = {
		headings: masterTableHeadings,
		rows: initRows
	};

	fs.readdirSync(HISTORY_FILES_DIRECTORY).map((file: string): InitExchangeObjRowsType => {
		// if (f === DISALLOWED_FILE_NAMES) return null;

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
	const { headings, rows } = exchangeRow;

	const fieldDateIndex = headings.findIndex((h: string): boolean => h === 'Date');
	const fieldTimeIndex = headings.findIndex((h: string): boolean => h === 'time');
	const fieldFeeIndex = headings.findIndex((h: string): boolean => h === 'Fee');
	const fieldAmountIndex = headings.findIndex((h: string): boolean => h === 'Amount');

	const dateOrTimeFieldIndex = (): number => {
		if ((fieldDateIndex && fieldDateIndex !== -1) ||
				fieldDateIndex === 0) {
			return fieldDateIndex;
		} else if ((fieldTimeIndex && fieldTimeIndex !== -1) ||
							fieldTimeIndex === 0) {
			return fieldTimeIndex;
		}
		return ID_FIELD_NOT_FOUND;
	};

	rows.map((r: Array<string>): Array<string> => {
		let fieldDateValue: string = '';
		const fieldFeeValue: string = r[fieldFeeIndex],
					fieldAmountValue: string = r[fieldAmountIndex];
					
		if (dateOrTimeFieldIndex() !== ID_FIELD_NOT_FOUND) {
			fieldDateValue = r[dateOrTimeFieldIndex()];
		}

		const masterTableRow = [
			fieldDateValue,
			fieldFeeValue,
			fieldAmountValue,
			exchangeRow.exchangeName || ''
		];
		
		newRows.push(masterTableRow);
		return masterTableRow;
	});

	return newRows;
};

