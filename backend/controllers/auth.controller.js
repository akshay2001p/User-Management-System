const db = require('../models');
const config = require('../config/auth.config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = db.user;
const Op = db.Sequelize.Op;

// Validate password policy
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return { valid: minLength && hasUpper && hasLower && hasNumber && hasSpecial };
};

// Registration
exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, phone } = req.body;
    // No password on registration
    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
      status: 'Awaiting Approval',
      password: '' // Placeholder, will be set on approval
    });
    res.status(201).send({ message: 'User registered successfully. Awaiting admin approval.' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user || user.status !== 'Active') {
      return res.status(401).send({ message: 'Invalid credentials.' });
    }

    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.secret, { expiresIn: '24h' });
    const isFirstLogin = user.isFirstLogin;

    res.status(200).send({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isFirstLogin,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Set new password (for first login)
exports.setPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match.' });
    }

    const validation = validatePassword(password);
    if (!validation.valid) {
      return res.status(400).send({ message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    user.password = password;
    user.isFirstLogin = false;
    await user.save();

    res.send({ message: 'Password set successfully.' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};