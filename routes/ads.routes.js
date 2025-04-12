const express = require('express');
const router = express.Router();
const adsController = require('../controllers/ads.controller');

router.get('/', adsController.getAds);
router.get('/:id', adsController.getAdById);
router.post('/', adsController.createAd);
router.delete('/:id', adsController.deleteAd);
router.put('/:id', adsController.updateAd);
router.get('/search/:searchPhrase', adsController.searchAds);

module.exports = router;
