const express = require('express');
const { searchManga, getMangaDetails } = require('../controllers/externalController');

const router = express.Router();

router.get('/manga/search', searchManga);
router.get('/manga/:id', getMangaDetails);

module.exports = router;
