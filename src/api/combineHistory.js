import fs from 'fs';
import xlsx from 'node-xlsx';

const HISTORY_FILES_DIRECTORY = './history-files';
const DISALLOWED_FILE_NAMES = '.DS_Store';

const readTheFiles = () => {
	const combinedHistory = [];

	fs.readdirSync(HISTORY_FILES_DIRECTORY).forEach((f) => {
		if (f === DISALLOWED_FILE_NAMES) return null;

		const parsedFile = xlsx.parse(`${HISTORY_FILES_DIRECTORY}/${f}`);
		const fileData = parsedFile[0].data; // currently assuming there is only one 'sheet' per file

		const headings = fileData.shift(); // headings are first item in array
		const cells = fileData;

		const uiFormatted = {
			headings,
			cells
		};

		return combinedHistory.push(uiFormatted);
	});
	return combinedHistory;
}

const get = (req, res) => {
	const parsedFiles = readTheFiles();
	return res.json(parsedFiles);
}

export default get;
