const express = require('express');
const Joi = require('joi');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { getProfile, updateProfile } = require('../controllers/userController');

const router = express.Router();

const updateSchema = Joi.object({
  username: Joi.string().min(2).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).min(1);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, validate(updateSchema), updateProfile);

module.exports = router;
