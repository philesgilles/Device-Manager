const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    uniqueId: String,
    name: String,
    description: String,
    config: Object,
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation'
    },
    deviceType: {
      type: Schema.Types.ObjectId,
      ref: 'DeviceType'
    },
    sensors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Sensor'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', deviceSchema);
