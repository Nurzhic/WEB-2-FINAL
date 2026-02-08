const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['planned', 'reading', 'completed', 'on-hold', 'dropped'],
      default: 'planned',
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    volumes: {
      type: Number,
      min: 1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Manga', mangaSchema);
