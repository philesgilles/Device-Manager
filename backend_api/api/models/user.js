const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    level: Number,
    info: Object,
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
