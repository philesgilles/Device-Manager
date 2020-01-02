const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organisationSchema = Schema(
  {
    _id: { type: Schema.ObjectId, auto: true },
    name: String,
    description: String,
    info: Object,
    devices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Device'
      }
    ],
    equipments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Equipment'
      }
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organisation', organisationSchema);
