// @flow
import type { $Request, $Response } from 'express';
import { createMasterHistoryFromLocalCsvs } from '../utils/masterHistoryLocal';
import createNewCsv from '../utils/masterHistoryLocal/createNewCsv';

export const getMasterHistoryFromLocalCsvs = (
	req: $Request,
	res: $Response,
): $Response => {
	const parsedFiles = createMasterHistoryFromLocalCsvs();
	return res.json(parsedFiles);
};

export const getMasterCsvUrlFromLocalCsvs = (
	req: $Request,
	res: $Response,
): any => {
	createNewCsv().then((data: Object): any => { 
		return res.json({ link: data });
	});
};
