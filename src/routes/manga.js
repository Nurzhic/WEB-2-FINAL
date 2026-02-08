const express = require('express');
const Joi = require('joi');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createManga,
  getMangaList,
  getMangaById,
  updateManga,
  deleteManga,
} = require('../controllers/mangaController');

const router = express.Router();

const mangaSchema = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().max(2000).allow(''),
  status: Joi.string().valid('planned', 'reading', 'completed', 'on-hold', 'dropped'),
  rating: Joi.number().min(1).max(10),
  coverImage: Joi.string().uri().allow(''),
  volumes: Joi.number().min(1),
});

const mangaUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(120),
  description: Joi.string().max(2000).allow(''),
  status: Joi.string().valid('planned', 'reading', 'completed', 'on-hold', 'dropped'),
  rating: Joi.number().min(1).max(10),
  coverImage: Joi.string().uri().allow(''),
  volumes: Joi.number().min(1),
}).min(1);

router.use(auth);

router.post('/', validate(mangaSchema), createManga);
router.get('/', getMangaList);
router.get('/:id', getMangaById);
router.put('/:id', validate(mangaUpdateSchema), updateManga);
router.delete('/:id', deleteManga);

module.exports = router;
