const db = require('../models');
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');

// Get all users (with filters)
exports.findAll = async (req, res) => {
  const { search, status } = req.query;
  const where = {};

  if (search) {
    where[Op.or] = [
      { firstname: { [Op.iLike]: `%${search}%` } },
      { lastname: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  if (status) {
    where.status = status;
  }

  try {
    const users = await User.findAll({ where });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get user by ID
exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update user
exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // If updating password, validate
    if (req.body.password) {
      const validation = validatePassword(req.body.password); // Import or define here
      if (!validation.valid) {
        return res.status(400).send({ message: 'Invalid password format.' });
      }
    }

    await user.update(req.body);
    res.send({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Approve user
exports.approve = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.status === 'Active') {
      return res.status(400).send({ message: 'User not found or already approved.' });
    }

    const tempPassword = `${user.firstname}#2021`;
    await user.update({
      status: 'Active',
      password: tempPassword, // Will be hashed by hook
      isFirstLogin: true
    });

    res.send({ message: 'User approved successfully. Temporary password sent.' }); // In prod, email it
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete user
exports.delete = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }
    await user.destroy();
    res.send({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get current user details
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'firstname', 'lastname', 'email', 'phone', 'role', 'status']
    });
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};