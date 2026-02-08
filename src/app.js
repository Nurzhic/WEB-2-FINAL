const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const mangaRoutes = require('./routes/manga');
const externalRoutes = require('./routes/external');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api/external', externalRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.use(errorHandler);

module.exports = app;
