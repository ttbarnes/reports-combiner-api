// @flow
import type { $Request, $Response } from 'express';
import Snapshot from '../models/snapshot';

export const createSnapshot = (obj: Object): Object => {
  const newSnapshot = new Snapshot({
    userId: obj.userId,
    createdAt: new Date(),
    trades: obj.trades
  });
  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return newSnapshot.save((err: Object, snapshot: Object): Object => {
      if (err) {
        return reject('error saving snapshot');
      }
      return resolve(snapshot);
    });
  });
};

export const getSnapshot = (
  req: $Request,
  res: $Response,
): $Response => {
  return res.json({ snapshotData: true });
};

