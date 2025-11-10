const db = require('../models');
const User = db.user;
const ROLES = db.ROLES; // If roles table, else hardcoded

checkDuplicateEmailOrPhone = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({ message: 'Email is already in use!' });
      return;
    }

    User.findOne({
      where: {
        phone: req.body.phone
      }
    }).then(user => {
      if (user) {
        res.status(400).send({ message: 'Phone is already in use!' });
        return;
      }
      next();
    });
  });
};

module.exports = {
  checkDuplicateEmailOrPhone
};