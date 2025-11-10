const { authJwt, verifyRole } = require('../middleware');
const controller = require('../controllers/user.controller.js');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // Get current user
  app.get('/api/user/profile', [authJwt.verifyToken], controller.getCurrentUser);

  // Admin routes
  app.get('/api/users', [authJwt.verifyToken, verifyRole.isAdmin], controller.findAll);
  app.get('/api/users/:id', [authJwt.verifyToken, verifyRole.isAdmin], controller.findOne);
  app.put('/api/users/:id', [authJwt.verifyToken, verifyRole.isAdmin], controller.update);
  app.put('/api/users/:id/approve', [authJwt.verifyToken, verifyRole.isAdmin], controller.approve);
  app.delete('/api/users/:id', [authJwt.verifyToken, verifyRole.isAdmin], controller.delete);
};