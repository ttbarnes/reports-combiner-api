// @flow

import fs from 'fs';
import json2csv from 'json2csv';

const TEMP_FILE = './dl/test.csv';

const createNewCsv = (): any => {
  const fields = ['car', 'price', 'color'];
  const mockData = [
    {
      'exchange': 'Test 1',
      'price': 40000,
      'color': 'blue'
    }, {
      'exchange': 'Test 2',
      'price': 35000,
      'color': 'black'
    }, {
      'exchange': 'Test 3',
      'price': 60000,
      'color': 'green'
    }
  ];
  const csv = json2csv({ data: mockData, fields });
  
  return new Promise((resolve: any, reject: any): any => {
    return fs.writeFile(TEMP_FILE, csv, (err: any): any => {
      if (err) {
        return reject(err);
      }
      return resolve(TEMP_FILE.substring(2));
    });
  });
};

export default createNewCsv;
