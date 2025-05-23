const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const authController = require('../controllers/auth.controller');
const upload = require('../utils/imageUpload');

router.post(
  '/register',
  upload.single('avatar'),
  authController.validateRegister,
  authController.register
);
router.post('/login', authController.validateLogin, authController.login);
router.get('/user', authMiddleware, authController.getUser);
router.delete('/logout', authMiddleware, authController.logout);

module.exports = router;
