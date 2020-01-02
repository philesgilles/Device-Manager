const express = require('express');
const router = express.Router();
const Calibration = require('../models/calibration');
const Sensor = require('../models/sensor');
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
  const calibrations = await Calibration.find({}).populate(
    'sensor',
    'uniqueId'
  );
  res.status(200).json(calibrations);
});

router.get('/:calibrationId', async (req, res, next) => {
  const id = req.params.calibrationId;
  try {
    const calibration = await Calibration.findById(id).populate(
      'sensor',
      'uniqueId'
    );
    res.status(200).json(calibration);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  const calibration = new Calibration({
    _id: new mongoose.Types.ObjectId(),
    certificateNumber: req.body.calibrationNumber,
    values: req.body.values,
    sensor: req.body.sensorId
  });
  try {
    const result = await calibration.save();

    // add the calibration to sensor;
    const sensor = await Sensor.findById(req.body.sensorId);
    if (!sensor) {
      throw new Error('Sensor not found');
    }
    sensor.calibrations.push(result._id);
    await sensor.save();
    res.status(201).json(calibration);
    return result;
  } catch (err) {
    throw err;
  }
});

router.patch('/:calibrationId', async (req, res, next) => {
  const id = req.params.calibrationId;
  try {
    result = await Calibration.update(
      { _id: id },
      {
        $set: {
          values: req.body.values,
          sensor: req.body.sensorId
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:calibrationId', async (req, res, next) => {
  const id = req.params.calibrationId;
  try {
    result = await Calibration.remove({ _id: id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
