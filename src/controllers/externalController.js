const axios = require('axios');

const searchManga = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter q is required' });
    }

    const response = await axios.get('https://api.jikan.moe/v4/manga', {
      params: { q: query, limit: 10 },
    });

    const results = response.data?.data || [];
    return res.status(200).json({ results });
  } catch (err) {
    return next(err);
  }
};

const getMangaDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}`);
    const data = response.data?.data;
    if (!data) {
      return res.status(404).json({ message: 'Manga not found' });
    }
    return res.status(200).json({ data });
  } catch (err) {
    return next(err);
  }
};

module.exports = { searchManga, getMangaDetails };
