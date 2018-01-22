import xlsx from 'node-xlsx';

export function poc(req, res) {
	const workSheetsFromFile = xlsx.parse('./test.xlsx');
	return res.json(workSheetsFromFile);
}
