const Manga = require('../models/Manga');

const createManga = async (req, res, next) => {
  try {
    const manga = await Manga.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json(manga);
  } catch (err) {
    return next(err);
  }
};

const getMangaList = async (req, res, next) => {
  try {
    const manga = await Manga.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(manga);
  } catch (err) {
    return next(err);
  }
};

const getMangaById = async (req, res, next) => {
  try {
    const manga = await Manga.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    return res.status(200).json(manga);
  } catch (err) {
    return next(err);
  }
};

const updateManga = async (req, res, next) => {
  try {
    const manga = await Manga.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    return res.status(200).json(manga);
  } catch (err) {
    return next(err);
  }
};

const deleteManga = async (req, res, next) => {
  try {
    const manga = await Manga.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    return res.status(200).json({ message: 'Manga deleted' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createManga,
  getMangaList,
  getMangaById,
  updateManga,
  deleteManga,
};
