/* eslint-disable */
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema; // eslint-disable-line no-unused-vars

/**
 * Snapshot Schema
 */
const SnapshotSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  editedAt: {
    type: String
  },
  trades: [
    {
      price: String,
      timestamp: String,
      amount: String,
      fee: String,
      tradeType: String,
      exchangeName: String,
      note: String
    }
  ],
  exchanges: [ String ]
});

SnapshotSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((snapshot) => {
        if (snapshot) {
          return snapshot;
        }
        const err = { error: `snapshot #${id} not found` };
        return Promise.reject(err);
      });
  }
}

/**
 * @typedef Snapshot
 */
export default mongoose.model('Snapshot', SnapshotSchema);

/* eslint-enable */
