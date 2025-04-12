const Ad = require('../models/ad.model');

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
