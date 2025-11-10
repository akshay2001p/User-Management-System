const { Sequelize } = require('sequelize');
const sequelize = require('../config/db.config.js');
const User = require('./user.model.js');

sequelize.authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = User;

module.exports = db;