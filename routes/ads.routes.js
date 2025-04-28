const express = require('express');
const router = express.Router();
const adsController = require('../controllers/ads.controller');
const authMiddleware = require('../utils/authMiddleware');
const upload = require('../utils/imageUpload');

router.get('/', adsController.getAds);
router.get('/search/:searchPhrase', adsController.searchAds);
router.get('/:id', adsController.getAdById);
router.post(
  '/',
  authMiddleware,
  upload.single('photo'),
  adsController.validateAd,
  adsController.createAd
);
router.put(
  '/:id',
  authMiddleware,
  upload.single('photo'),
  adsController.validateUpdate,
  adsController.updateAd
);
router.delete('/:id', authMiddleware, adsController.deleteAd);

module.exports = router;
