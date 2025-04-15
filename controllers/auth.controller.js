const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const Session = require('../models/session.model');

exports.register = async (req, res, next) => {
  try {
    const { login, password, avatar, phone } = req.body;
    if (login && typeof login === 'string' && password && typeof password === 'string' && avatar && typeof avatar === 'string' && phone && typeof phone === 'string') {
      const userWithLogin = await User.findOne({ login });
      if (userWithLogin) {
        return res.status(409).send({ message: 'User with this login already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ login, password: hashedPassword, avatar, phone });
      await newUser.save();
      res.status(201).send({ message: 'User registered successfully ' + newUser.login });
    } else {
      res.status(422).send({ message: 'Bad request' });
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    if (login && typeof login === 'string' && password && typeof password === 'string') {
      const user = await User.findOne({ login });
      if (!user) {
        return res.status(401).send({ message: 'Login or password is incorrect' });
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          req.session.user = {
            id: user._id,
            login: user.login,
            avatar: user.avatar,
            phone: user.phone
          };
          return res.status(200).send({ message: 'Login successful' });
        } else {
          return res.status(401).send({ message: 'Login or password is incorrect' });
        }
      }
    } else {
      res.status(401).send({ message: 'Login or password is incorrect' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    res.status(200).send({
      login: req.session.user && req.session.user.login,
      avatar: req.session.user && req.session.user.avatar,
      phone: req.session.user && req.session.user.phone
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== "production") {
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
