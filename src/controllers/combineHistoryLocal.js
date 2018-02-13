// @flow
import type { $Request, $Response } from 'express';
import { createMasterTableFromLocalFiles } from '../utils/combinedHistoryLocal';
import createNewCsv from '../utils/combinedHistoryLocal/createNewCsv';

export const getCombinedHistoryLocal = (
	req: $Request,
	res: $Response,
): $Response => {
	const parsedFiles = createMasterTableFromLocalFiles();
	return res.json(parsedFiles);
};

export const getCombinedHistoryLocalCsvUrl = (
	req: $Request,
	res: $Response,
): any => {
	createNewCsv().then((data: Object): any => { 
		return res.json({ link: data });
	});
};


