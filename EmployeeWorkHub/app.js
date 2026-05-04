const express = require('express');
const multer = require('multer');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/uploads', express.static('uploads'));

// Multer error-handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size must not exceed 2MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  // fileFilter rejection — plain Error thrown by the filter callback
  if (err && err.message && err.message.includes('Only image/')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = app;
