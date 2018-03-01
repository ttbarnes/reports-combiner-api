// @flow
import type { MasterHistoryExchangeDataFieldNamesType } from '../masterHistory/masterHistory.types';
import fs from 'fs';
import json2csv from 'json2csv';

const TEMP_FILE_SNAPSHOT = './dl/test-snapshot.csv';
const TEMP_SNAPSHOT_DL_URL_RES = 'http://localhost:3000/dl/test-snapshot.csv';

const createCsvFromSnapshot = (snapshot: Object): Promise<string> => {
  const newRows = [];
  const fields: Array<MasterHistoryExchangeDataFieldNamesType> = [
    'price',
    'timestamp',
    'amount',
    'fee',
    'tradeType',
    'exchangeName',
    'note'
  ];
  let csvData = {
    fields,
    data: snapshot.trades
  };
  const csv = json2csv(csvData);
  return new Promise((resolve: any, reject: any): any => {
    return fs.writeFile(TEMP_FILE_SNAPSHOT, csv, (err: any): any => {
      if (err) {
        return reject(err);
      }
      return resolve(TEMP_SNAPSHOT_DL_URL_RES);
    });
  });
};

export default createCsvFromSnapshot;
