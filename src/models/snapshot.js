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

/**
 * @typedef Snapshot
 */
export default mongoose.model('Snapshot', SnapshotSchema);

/* eslint-enable */
