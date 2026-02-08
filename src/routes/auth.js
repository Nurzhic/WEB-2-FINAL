const express = require('express');
const Joi = require('joi');
const { register, login } = require('../controllers/authController');
const { validate } = require('../middleware/validate');

const router = express.Router();

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

module.exports = router;
