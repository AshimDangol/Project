const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { getProfile, uploadAvatar } = require('../controllers/userController');

const router = express.Router();

router.get('/:id', authenticate, getProfile);
router.post('/:id/avatar', authenticate, upload.single('avatar'), uploadAvatar);

module.exports = router;
