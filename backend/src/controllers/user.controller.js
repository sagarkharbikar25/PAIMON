/* =============================================
   user.controller.js
   Pravas — User Controller
   ============================================= */

const User = require('../models/user.model');
const { AppError } = require('../middleware/error.middleware');

// ✅ Get current user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ✅ Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, mobile, dateOfBirth, age, country, state } = req.body;
    
    const allowedFields = ['name', 'mobile', 'dateOfBirth', 'age', 'country', 'state'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return next(new AppError('No valid data provided', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      user 
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Update photo URL (if implemented later)
const updatePhotoUrl = async (req, res, next) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) return next(new AppError('Photo URL is required', 400));

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { photoUrl } },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ 
      success: true, 
      message: 'Profile photo updated successfully',
      user 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserProfile, updateProfile, updatePhotoUrl };