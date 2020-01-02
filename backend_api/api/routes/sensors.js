const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensor');
const Device = require('../models/device');
const Equipment = require('../models/equipment');
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
  const sensors = await Sensor.find({})
    .populate('linkedDevice', 'uniqueId')
    .populate('linkedEquipment', 'uniqueId')
    .populate('calibrations', 'certificateNumber');
  res.status(200).json(sensors);
});

router.get('/:sensorId/:query', async (req, res, next) => {
  console.log(req.query);
  const id = req.params.sensorId;
  const query = req.params.query;
  console.log(id, query);

  let result = await Sensor.findOne({ uniqueId: id })
    .populate('calibrations')
    .populate('linkedDevice')
    .populate('linkedEquipment');
  if (!result) {
    res.status(404).json({ message: 'sensor not found' });
    return;
  }
  switch (query) {
    case 'all':
      break;
    //Case of asked calibration
    case 'calibration':
      let validCalibration;
      const time = new Date().getTime();
      if (result.calibrations.length === 0) {
        result = {
          calibration: false
        };
      } else {
        result.calibrations.forEach(calibration => {
          const validFrom = new Date(calibration.values.validFrom).getTime();
          const validTo = new Date(calibration.values.validTo).getTime();
          if (validFrom < time && time < validTo) {
            validCalibration = calibration.values;
            validCalibration.calibration = true;
          }
          if (validCalibration !== '') {
            result = validCalibration;
          } else {
            result = {
              calibration: false
            };
          }
        });
      }
      break;
    case 'calibrations':
      result = result.calibrations;
      break;
    case 'equipment':
      result = result.linkedEquipment;
      break;
  }
  res.status(200).json(result);
});

router.post('/', async (req, res, next) => {
  const sensor = new Sensor({
    _id: new mongoose.Types.ObjectId(),
    uniqueId: req.body.uniqueId,
    description: req.body.description,
    type: req.body.type,
    linkedDevice: req.body.deviceId,
    linkedEquipment: req.body.equipmentId
  });
  try {
    const result = await sensor.save();

    // if deviceId save to device
    if (req.body.deviceId !== '') {
      const device = await Device.findById(req.body.deviceId);
      device.sensors.push(result._id);
      await device.save();
    }
    //If equipmentId save to equipment
    if (req.body.equipmentId !== '') {
      const equipment = await Equipment.findById(req.body.equipmentId);
      equipment.sensor = result._id;
      await equipment.save();
    }
    res.status(201).json(sensor);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.patch('/:sensorId', async (req, res, next) => {
  const id = req.params.sensorId;
  try {
    result = await Sensor.update(
      { _id: id },
      {
        $set: {
          uniqueId: req.body.uniqueId,
          description: req.body.description,
          type: req.body.type,
          linkedDevice: req.body.deviceId,
          linkedEquipment: req.body.equipmentId
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:sensorId', async (req, res, next) => {
  const id = req.params.sensorId;
  try {
    result = await Sensor.remove({ _id: id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
