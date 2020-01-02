const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Organisation = require('../models/organisation');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res, next) => {
  let users = await User.find()
    .select('-password')
    .populate('organisation', 'name');
  res.status(200).json(users);
});

router.get('/:userId', async (req, res, next) => {
  const id = req.params.userId;
  try {
    let user = await User.findById(id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  let user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    username: req.body.username,
    password: hashedPassword,
    info: req.body.info,
    level: 0,
    organisation: mongoose.Types.ObjectId(req.body.organisationId)
  });
  try {
    const result = await user.save();
    //save organisation if needed
    if (req.body.organisationId) {
      const organisation = await Organisation.findById(req.body.organisationId);
      organisation.users.push(mongoose.Types.ObjectId(result._id));
      await organisation.save();
    }
    user.password = null;
    res.status(201).json(user);
  } catch (err) {
    throw err;
  }
});

router.patch('/:userId', async (req, res, next) => {
  const id = req.params.userId;
  try {
    result = await User.update(
      { _id: id },
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          info: req.body.info
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:userId', async (req, res, next) => {
  const id = req.params.userId;
  try {
    result = await User.remove({ _id: id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
