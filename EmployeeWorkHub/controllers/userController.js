const fs = require('fs');
const User = require('../models/User');

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage && user.profileImage.filePath ? `/${user.profileImage.filePath}` : null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function uploadAvatar(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.profileImage && user.profileImage.filePath) {
      try {
        await fs.promises.unlink(user.profileImage.filePath);
      } catch (_err) {
        // Ignore errors if file doesn't exist
      }
    }

    user.profileImage = { filePath: req.file.path, originalName: req.file.originalname };
    await user.save();

    return res.status(200).json({
      profileImageUrl: `/${user.profileImage.filePath}`,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getProfile, uploadAvatar };
