const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipmentSchema = Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    uniqueId: String,
    description: String,
    sensor: {
      type: Schema.Types.ObjectId,
      ref: 'Sensor'
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
