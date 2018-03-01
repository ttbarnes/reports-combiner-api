// @flow
import type { $Request, $Response } from 'express';
import express from 'express';
import { getSnapshotUrl } from '../controllers/snapshot';

const router = express.Router(); // eslint-disable-line new-cap

// router.route('/')
  // POST snapshot
  // .post(createSnapshot);

// router.route('/:snapshotId')
  // GET snapshot
  // .get(getSnapshot);

  router.route('/:snapshotId/download')
  // GET snapshot url
    .get(getSnapshotUrl);

export default router;

