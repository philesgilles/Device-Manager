const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sensorSchema = Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    uniqueId: String,
    description: String,
    type: String,
    linkedDevice: {
      type: Schema.Types.ObjectId,
      ref: 'Device'
    },
    linkedEquipment: {
      type: Schema.Types.ObjectId,
      ref: 'Equipment'
    },
    calibrations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Calibration'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sensor', sensorSchema);
