const User = require('../models/user.model');

//Create a user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Get a user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get user by ID
exports.getUserById = async (req, res) => {
  try {
    // A user can view their own profile; only admins can view anyone else's
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this user' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update User
exports.updateUser = async (req, res) => {
  try {
    // A user can update their own profile; only admins can update anyone else's
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this user' });
    }

    const updates = { ...req.body };

    // Never allow password changes through this endpoint — findByIdAndUpdate
    // bypasses the model's pre('save') hashing hook, so a raw password here
    // would get stored in plain text. A dedicated change-password flow
    // (that uses .save() so hashing runs) should handle that separately.
    delete updates.password;

    // Only an admin can change roles, and never their own (avoids a lone
    // admin accidentally demoting themselves with no one left to fix it)
    if (updates.role && (req.user.role !== 'admin' || req.user._id.toString() === req.params.id)) {
      delete updates.role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Delete user By Id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};