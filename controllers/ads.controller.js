const { body, validationResult } = require('express-validator');
const Ad = require('../models/ad.model');

exports.validateAd = [
  body('title')
    .isLength({ min: 10, max: 50 })
    .withMessage('Title must be between 10 and 50 characters long.'),
  body('description')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters long.'),
  body('photo')
    .custom((value) => {
      if (typeof value === 'string' && value.startsWith('/')) {
        return true;
      }
      return validator.isURL(value);
    })
    .withMessage('Photo must be a valid absolute URL or a relative path.'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number.')
    .custom(value => value >= 0)
    .withMessage('Price must be at least 0.'),
  body('location')
    .notEmpty()
    .withMessage('Location is required.'),
  body('sellerInfo')
    .notEmpty()
    .withMessage('Seller info is required.')
];

exports.getAds = async (req, res, next) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (err) {
    next(err);
  }
};

exports.getAdById = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.json(ad);
  } catch (err) {
    next(err);
  }
};

exports.createAd = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { title, description, photo, price, location, sellerInfo } = req.body;
    const newAd = new Ad({
      title,
      description,
      photo,
      price,
      location,
      sellerInfo
    });
    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (err) {
    next(err);
  }
};

exports.updateAd = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.json(updatedAd);
  } catch (err) {
    next(err);
  }
};

exports.deleteAd = async (req, res, next) => {
  try {
    const deletedAd = await Ad.findByIdAndDelete(req.params.id);
    if (!deletedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.json({ message: 'Ad successfully deleted' });
  } catch (err) {
    next(err);
  }
};

exports.searchAds = async (req, res, next) => {
  try {
    const { searchPhrase } = req.params;
    const ads = await Ad.find({
      title: { $regex: searchPhrase, $options: 'i' }
    });
    res.json(ads);
  } catch (err) {
    next(err);
  }
};
