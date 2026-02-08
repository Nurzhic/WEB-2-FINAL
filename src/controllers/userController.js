const User = require('../models/User');

const getProfile = async (req, res) => {
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user._id.toString()) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    if (username) req.user.username = username;
    if (email) req.user.email = email;
    if (password) req.user.password = password;

    await req.user.save();

    return res.status(200).json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      updatedAt: req.user.updatedAt,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getProfile, updateProfile };
