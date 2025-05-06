const { body, validationResult } = require('express-validator');
const Ad = require('../models/Ad.model');
const getImageFileType = require('../utils/getImageFileType');

exports.validateAd = [
  body('title').isLength({ min: 10, max: 50 }).withMessage('Title must be between 10 and 50 characters long.'),
  body('description').isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20 and 1000 characters long.'),
  body('price').isNumeric().withMessage('Price must be a number.').custom(value => value >= 0).withMessage('Price must be at least 0.'),
  body('location').notEmpty().withMessage('Location is required.'),
  body('sellerInfo').notEmpty().withMessage('Seller info is required.')
];

exports.validateUpdate = [
  body('title').optional({ checkFalsy: true }).isLength({ min: 10, max: 50 }).withMessage('Title must be between 10 and 50 characters long.'),
  body('description').optional({ checkFalsy: true }).isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20 and 1000 characters long.'),
  body('price').optional({ checkFalsy: true }).isNumeric().withMessage('Price must be a number.').custom(value => value >= 0).withMessage('Price must be at least 0.'),
  body('location').optional({ checkFalsy: true }).notEmpty().withMessage('Location is required.'),
  body('sellerInfo').optional({ checkFalsy: true }).notEmpty().withMessage('Seller info is required.')
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
    if (!ad) return res.status(404).json({ message: 'Ad not found' });
    res.json(ad);
  } catch (err) {
    next(err);
  }
};

exports.createAd = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    const { title, description, price, location, sellerInfo } = req.body;
    let fileType = 'unknown';
    if (req.file) {
      fileType = req.file.location ? req.file.mimetype : await getImageFileType(req.file);
    }
    if (!['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
      return res.status(422).json({ message: 'Invalid image type' });
    }
    const photoUrl = req.file
      ? (req.file.location ? req.file.location : `/uploads/${req.file.filename}`)
      : undefined;
    const newAd = new Ad({ title, description, photo: photoUrl, price, location, sellerInfo });
    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (err) {
    next(err);
  }
};

exports.updateAd = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    const updateData = {};
    ['title', 'description', 'price', 'location', 'sellerInfo'].forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        updateData[field] = req.body[field];
      }
    });
    if (req.file) {
      let fileType = req.file.location ? req.file.mimetype : await getImageFileType(req.file);
      if (!['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
        return res.status(422).json({ message: 'Invalid image type' });
      }
      updateData.photo = req.file.location
        ? req.file.location
        : `/uploads/${req.file.filename}`;
    }
    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updatedAd) return res.status(404).json({ message: 'Ad not found' });
    res.json(updatedAd);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(422).json({ message: err.message });
    }
    next(err);
  }
};

exports.deleteAd = async (req, res, next) => {
  try {
    const deletedAd = await Ad.findByIdAndDelete(req.params.id);
    if (!deletedAd) return res.status(404).json({ message: 'Ad not found' });
    res.json({ message: 'Ad successfully deleted' });
  } catch (err) {
    next(err);
  }
};

exports.searchAds = async (req, res, next) => {
  try {
    const ads = await Ad.find({ title: { $regex: req.params.searchPhrase, $options: 'i' } });
    res.json(ads);
  } catch (err) {
    next(err);
  }
};
