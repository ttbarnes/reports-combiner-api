// @flow
import type { $Request, $Response } from 'express';
import { createMasterTableFromLocalFiles } from '../utils';
import createNewCsv from '../utils/createNewCsv';

export const getCombinedHistoryLocal = (
	req: $Request,
	res: $Response,
): $Response => {
	const parsedFiles = createMasterTableFromLocalFiles();
	return res.json(parsedFiles);
};

export const getCombinedHistoryLocalCsvUrl
 = (
	req: $Request,
	res: $Response,
): $Response => {
	createNewCsv().then((data: Object): $Response => { 
		return res.json({ link: data });
	});
};


