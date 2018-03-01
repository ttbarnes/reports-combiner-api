import express from 'express';
import {
  getMasterHistoryFromLocalCsvs,
  getMasterCsvUrlFromLocalCsvs
} from '../controllers/masterHistoryLocal';

const router = express.Router(); // eslint-disable-line new-cap

// GET combine multiple CSV / XLSX files into one, from 'history-files' directory
router.route('/master-history/local')
  .get(getMasterHistoryFromLocalCsvs);

// GET create new CSV from multiple CSV/XLSX files, from 'history-files' directory
// plan is to send the data from a client rather than using local files
router.route('/master-history/local/download')
  .get(getMasterCsvUrlFromLocalCsvs);

export default router;
