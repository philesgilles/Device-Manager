const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceTypeSchema = Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    uniqueId: String,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeviceType', deviceTypeSchema);
