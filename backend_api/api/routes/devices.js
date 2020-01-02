const express = require('express');
const router = express.Router();
const Device = require('../models/device');
const Organisation = require('../models/organisation');
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
  const devices = await Device.find({})
    .populate('organisation', 'name')
    .populate('sensor', 'uniqueId')
    .populate('deviceType', 'name');
  res.status(200).json(devices);
});

router.get('/:deviceId', async (req, res, next) => {
  const id = req.params.deviceId;
  try {
    const device = await Device.findOne({ uniqueId: id })
      .populate('organisation', 'name')
      .populate('sensors');
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  const device = new Device({
    _id: new mongoose.Types.ObjectId(),
    uniqueId: req.body.uniqueId,
    name: req.body.name,
    description: req.body.description,
    config: req.body.config || {},
    organisation: req.body.organisationId,
    deviceType: req.body.deviceType
  });
  try {
    const result = await device.save();
    //save organisation if needed
    if (req.body.organisationId) {
      const organisation = await Organisation.findById(req.body.organisationId);
      organisation.devices.push(result._id);
      await organisation.save();
    }
    res.status(201).json(device);
  } catch (err) {
    throw err;
  }
});

router.patch('/:deviceId', async (req, res, next) => {
  const id = req.params.deviceId;
  try {
    result = await Device.update(
      { _id: id },
      {
        $set: {
          uniqueId: req.body.uniqueId,
          name: req.body.name,
          description: req.body.description,
          config: req.body.config,
          organisation: req.body.organisationId,
          deviceType: req.body.deviceType
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:deviceId', async (req, res, next) => {
  const id = req.params.deviceId;
  try {
    result = await Device.remove({ _id: id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
