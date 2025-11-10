const sequelize = require('../config/db.config.js');
const User = require('./user.model.js');

User.init(sequelize.models); 

sequelize.authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;