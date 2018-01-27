// @flow

import fs from 'fs';
import xlsx from 'node-xlsx';

// todo: learn use real type definitions for express
type ReqType = { body?: Object };
type ResType = { json: Function };

type CombinedHistoryObjType = {
	headings: Array<string>;
	rows: Array<number | string>
};

const HISTORY_FILES_DIRECTORY = './history-files';
const DISALLOWED_FILE_NAMES = '.DS_Store';

const getAndReadLocalFiles = (): Array<CombinedHistoryObjType> => {
	const combinedHistory: Array<CombinedHistoryObjType> = [];

	fs.readdirSync(HISTORY_FILES_DIRECTORY).forEach((f: string): CombinedHistoryObjType | null => {
		if (f === DISALLOWED_FILE_NAMES) return null;

		const parsedFile = xlsx.parse(`${HISTORY_FILES_DIRECTORY}/${f}`);
		const fileData = parsedFile[0].data; // currently assuming there is only one 'sheet' per file

		const headings = fileData.shift(); // headings are first item in array
		const rows = fileData;

		const uiFormatted: CombinedHistoryObjType = {
			headings,
			rows
		}; 

		combinedHistory.push(uiFormatted);
		return uiFormatted;
	});
	return combinedHistory;
};


const get = (
	req: ReqType,
	res: ResType,
): Object => {
	const parsedFiles = getAndReadLocalFiles();
	return res.json(parsedFiles);
};

export default get;
