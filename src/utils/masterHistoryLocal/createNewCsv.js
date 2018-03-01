// @flow
import type { MasterHistoryExchangeDataFieldNamesType } from '../masterHistory/masterHistory.types';
import fs from 'fs';
import json2csv from 'json2csv';
import { createMasterHistoryFromLocalCsvs } from './index';

const TEMP_FILE = './dl/test.csv';
const TEMP_FILE_DL_URL_RES = 'http://localhost:3000/dl/test.csv';

type CsvDataArrObjType = {
  date?: string,
  type?: string,
  market?: string,
  amount?: string,
  price?: string,
  fee?: string,
  feeCurrency?: string,
  exchange?: string,
  note?: string
};

type CsvDataType = {
  fields?: Array<string>,
  data?: Array<CsvDataArrObjType>
};

/*
* create object structure json2csv expects
* takes masterTable rows structure: [ ['a', 'b', 'c'] ]
* returns same masterTable structure but with rows as array of objects
*/
const createCsvDataObj = (): CsvDataArrObjType => {
  const origFields = createMasterHistoryFromLocalCsvs();
  const { headings, rows } = origFields;
  const newRows = [];
  rows.map((cell: any): CsvDataArrObjType => {
    let newCell = {};
    cell.map((c: string, index: number): string => {
      return newCell[headings[index]] = c;
    });
    newRows.push(newCell);
    return newCell;
  });
  let csvData = {};
  csvData.fields = headings;
  csvData.data = newRows;
  return csvData;
};

const createNewCsv = (): any => {
  const csvData = createCsvDataObj();
  const csv = json2csv(csvData);
  return new Promise((resolve: any, reject: any): any => {
    return fs.writeFile(TEMP_FILE, csv, (err: any): any => {
      if (err) {
        return reject(err);
      }
      return resolve(TEMP_FILE_DL_URL_RES);
    });
  });
};

export default createNewCsv;
