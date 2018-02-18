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
  trades: [
    {
      price: String,
      timestamp: String,
      amount: String,
      fee: String,
      tradeType: String,
      exchangeName: String,
      uiAddNote: Boolean
    }
  ]
});

SnapshotSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((snapshot) => {
        if (snapshot) {
          return snapshot;
        }
        const err = { error: true };
        return Promise.reject(err);

      });
  }
}

/**
 * @typedef Snapshot
 */
export default mongoose.model('Snapshot', SnapshotSchema);

/* eslint-enable */
