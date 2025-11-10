const { checkDuplicateEmailOrPhone } = require('../middleware/verifySignUp');
const { verifyToken } = require('../middleware/authJwt');
const controller = require('../controllers/auth.controller.js');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post('/api/auth/register', [checkDuplicateEmailOrPhone], controller.register);
  app.post('/api/auth/login', controller.login);
  app.post('/api/auth/set-password', [verifyToken], controller.setPassword);
};