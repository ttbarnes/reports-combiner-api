// @flow
import type { $Request, $Response } from 'express';
import Snapshot from '../models/snapshot';
import {
  getUserById,
  updateUserSnapshotId
} from './user';

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
  snapshotId: string
): Object => {
  return Snapshot.get(snapshotId)
    .then((data: Object): Object => data)
    .catch((err: any): Object => err);
};

export const updateSnapshotNote = (
  snapshotId: string,
  rowId: string,
  note: string
): any => {
  return Snapshot.findOneAndUpdate(
    {
      _id: snapshotId,
      'trades._id': rowId
    }, 
    {
      '$set': {
        'trades.$.note': note
      }
    },
    { new: true }
  )
  .exec()
  .then((data: any, err: any): Object => {
    if (err) {
      return { error: true };
    }
    return data;
  });
};



/*
* createSnapshotResponseObj
*
* create new object with history `fields` and `trades` arrays
* otherwise create a new snapshot
*/
const createSnapshotResponseObj = (fields: Array<Object>, trades: Array<Object>): Object => {
  return {
    fields,
    trades
  };
};

/*
* handleGetSnapshot
*
* get a user's snapshot from user.snapshotId
* otherwise create a new snapshot
* returns express response with new/existing snapshot
*/
export const handleGetSnapshot = (res: $Response, tradeHistory: Object, userId: string): Promise<$Response> => {
  return new Promise((resolve: any, reject: any): Promise<Object> => {
    return getUserById(userId).then((user: Object): Promise<Object> => {
      const userHasExistingSnapshot = user.snapshotId;
      if (userHasExistingSnapshot) {
        return getSnapshot(user.snapshotId).then((snapshot: Object): Promise<$Response> =>
          resolve(res.json(
            createSnapshotResponseObj(
              tradeHistory.fields,
              snapshot.trades
            )
          ))
        );
      } else {
        return createSnapshot({
          fields: tradeHistory.fields,
          trades: tradeHistory.trades,
          userId
        }).then((snapshot: Object): Promise<Object> => {
          return updateUserSnapshotId(userId, snapshot._id).then((updatedUser: Object): Object =>
            resolve(res.json(
              snapshot
            ))
          );
        }, (err: any): Promise<$Response> =>
          reject(res.json(
            { error: true }
          ))
        );
      }
    });
  });
};
