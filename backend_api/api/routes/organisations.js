const express = require('express');
const router = express.Router();
const Organisation = require('../models/organisation');
const User = require('../models/user');
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
  const organisations = await Organisation.find({});
  res.status(200).json(organisations);
});

router.get('/:organisationId', async (req, res, next) => {
  const id = req.params.organisationId;
  try {
    const organisation = await Organisation.findById(id);
    res.status(200).json(organisation);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  const organisation = new Organisation({
    name: req.body.name,
    description: req.body.description,
    info: req.body.info || {}
  });
  try {
    await organisation.save();
    res.status(201).json(organisation);
  } catch (err) {
    throw err;
  }
});

router.patch('/:organisationId', async (req, res, next) => {
  const id = req.params.organisationId;
  try {
    result = await Organisation.update(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          info: req.body.info
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:organisationId', async (req, res, next) => {
  const id = req.params.organisationId;
  try {
    result = await Organisation.remove({ _id: id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
