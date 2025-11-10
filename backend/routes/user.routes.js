const { verifyToken } = require('../middleware/authJwt');  // Fixed: Specific file
const { isAdmin } = require('../middleware/verifyRole');  // Fixed: Specific file
const controller = require('../controllers/user.controller.js');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // Get current user (protected)
  app.get('/api/user/profile', [verifyToken], controller.getCurrentUser);

  // Admin routes (protected + admin role)
  app.get('/api/users', [verifyToken, isAdmin], controller.findAll);
  app.get('/api/users/:id', [verifyToken, isAdmin], controller.findOne);
  app.put('/api/users/:id', [verifyToken, isAdmin], controller.update);
  app.put('/api/users/:id/approve', [verifyToken, isAdmin], controller.approve);
  app.delete('/api/users/:id', [verifyToken, isAdmin], controller.delete);
};