// @flow
import type { $Request, $Response } from 'express';
import Snapshot from '../models/snapshot';
import {
  getUserById,
  updateUserSnapshotId
} from './user';
import createCsvFromSnapshot from '../utils/csv';

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

const updateSnapshot = (snapshotId: string, trades: Array<Object>, exchanges: Array<string>): Object => {
  return getSnapshot(snapshotId).then((snapshot: Object): Object => {
    snapshot.trades = trades;
    snapshot.exchanges = exchanges;
    snapshot.editedAt = new Date();
    return snapshot.save();
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
const createSnapshotResponseObj = (fields: Array<Object>, trades: Array<Object>, exchanges: Array<string>): Object => {
  return {
    fields,
    trades,
    exchanges
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
      const userHasSnapshot = user.snapshotId;

     if (userHasSnapshot) {
        return updateSnapshot(
          user.snapshotId,
          tradeHistory.trades,
          tradeHistory.exchanges
        ).then((savedSnapshot: Object): Promise<Object> => {
          return resolve(res.json(
            createSnapshotResponseObj(
              tradeHistory.fields,
              savedSnapshot.trades,
              savedSnapshot.exchanges
            )
          ));
        });

      } else {
        return createSnapshot({
          fields: tradeHistory.fields,
          trades: tradeHistory.trades,
          exchanges: tradeHistory.exchanges,
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


export const getSnapshotUrl = (
  req: $Request,
  res: $Response
): Object => {
  const snapshotId = req.params.snapshotId;
  return new Promise((resolve: any, reject: any): Promise<Object> =>
    getSnapshot(snapshotId).then((snapshot: Object): Promise<$Response> =>
      createCsvFromSnapshot(snapshot).then((downloadUrl: string): Object =>
        resolve(res.json({ link: downloadUrl }))
      )
    )
  );
};
