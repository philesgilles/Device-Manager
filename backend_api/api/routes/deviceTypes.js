const express = require('express');
const router = express.Router();
const DeviceType = require('../models/deviceType');
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
  const deviceTypes = await DeviceType.find({});
  res.status(200).json(deviceTypes);
});

router.get('/:deviceTypeId', async (req, res, next) => {
  const id = req.params.deviceTypeId;
  try {
    const deviceType = await DeviceType.findById(id);
    res.status(200).json(deviceType);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  const deviceType = new DeviceType({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    uniqueId: req.body.uniqueId,
    description: req.body.description
  });
  try {
    await deviceType.save();
    res.status(201).json(deviceType);
  } catch (err) {
    throw err;
  }
});

router.patch('/:deviceTypeId', async (req, res, next) => {
  const id = req.params.deviceTypeId;
  try {
    result = await DeviceType.update(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          uniqueId: req.body.uniqueId,
          description: req.body.description
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:deviceTypeId', async (req, res, next) => {
  const id = req.params.deviceTypeId;
  try {
    result = await DeviceType.remove({ _id: id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
