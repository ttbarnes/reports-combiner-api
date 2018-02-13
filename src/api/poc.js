import express from 'express';
import {
  getCombinedHistoryLocal,
  getCombinedHistoryLocalCsvUrl
} from '../controllers/combineHistoryLocal';

const router = express.Router(); // eslint-disable-line new-cap

// GET combine multiple CSV / XLSX files into one, from 'history-files' directory
router.route('/combined-history/local')
  .get(getCombinedHistoryLocal);

// GET create new CSV from multiple CSV/XLSX files, from 'history-files' directory
// plan is to send the data from a client rather than using local files
router.route('/combined-history/local/download')
  .get(getCombinedHistoryLocalCsvUrl);


export default router;
