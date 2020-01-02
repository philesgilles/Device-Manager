const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');
const Organisation = require('../models/organisation');
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
  const equipments = await Equipment.find({})
    .populate('organisation', 'name')
    .populate('sensor', 'uniqueId');
  res.status(200).json(equipments);
});

router.get('/:equipmentId', async (req, res, next) => {
  const id = req.params.equipmentId;
  try {
    const equipment = await Equipment.findOne({ uniqueId: id })
      .populate('sensor', 'uniqueId')
      .populate('organisation', 'name');
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  const equipment = new Equipment({
    _id: new mongoose.Types.ObjectId(),
    uniqueId: req.body.uniqueId,
    name: req.body.name,
    description: req.body.description,
    organisation: req.body.organisationId
  });
  try {
    const result = await equipment.save();
    //save organisation if needed
    if (req.body.organisationId) {
      const organisation = await Organisation.findById(req.body.organisationId);
      organisation.equipments.push(result._id);
      await organisation.save();
    }
    res.status(201).json(equipment);
  } catch (err) {
    throw err;
  }

  device
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  res.status(201).json(device);
});

router.patch('/:equipmentId', async (req, res, next) => {
  const id = req.params.equipmentId;
  try {
    result = await Equipment.update(
      { _id: id },
      {
        $set: {
          uniqueId: req.body.uniqueId,
          name: req.body.name,
          description: req.body.description,
          organisation: req.body.organisationId
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:equipmentId', async (req, res, next) => {
  const id = req.params.equipmentId;
  try {
    result = await Equipment.remove({ _id: id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
