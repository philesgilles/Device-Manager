const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calibrationSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    certificateNumber: String,
    values: Object,
    sensor: {
      type: Schema.Types.ObjectId,
      ref: 'Sensor'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Calibration', calibrationSchema);
