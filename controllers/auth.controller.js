const { body, validationResult } = require('express-validator');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const Session = require('../models/Session.model');
const getImageFileType = require('../utils/getImageFileType');

exports.validateRegister = [
  body('login')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Login is required'),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Phone is required'),
];

exports.validateLogin = [
  body('login')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Login is required'),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required'),
];

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (!req.file) {
      return res.status(422).json({ message: 'Avatar is required' });
    }

    const { login, password, phone } = req.body;
    let fileType;
    let avatarFilename;

    if (req.file.location) {
      fileType = req.file.mimetype;
      avatarFilename = req.file.key;
    } else {
      fileType = await getImageFileType(req.file);
      avatarFilename = req.file.filename;
    }

    if (!['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
      return res.status(422).json({ message: 'Invalid image type' });
    }

    const existing = await User.findOne({ login });
    if (existing) {
      return res.status(409).json({ message: 'User with this login already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      login,
      password: hashed,
      avatar: avatarFilename,
      phone,
    });
    await newUser.save();

    res.status(201).json({ message: `User registered successfully: ${newUser.login}` });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { login, password } = req.body;
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ message: 'Login or password are incorrect' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Login or password are incorrect' });
    }

    req.session.user = {
      id:     user._id.toString(),
      login:  user.login,
      avatar: user.avatar,
      phone:  user.phone,
    };
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
};

exports.getUser = (req, res, next) => {
  try {
    const u = req.session.user || {};
    res.status(200).json({
      login:  u.login  || null,
      avatar: u.avatar || null,
      phone:  u.phone  || null,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await Session.deleteMany({});
    }
    req.session.destroy(err => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (err) {
    next(err);
  }
};
