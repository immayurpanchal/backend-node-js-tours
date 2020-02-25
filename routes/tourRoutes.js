const express = require('express');
const tourController = require('../controllers/tourController');

// Tour Router
const router = express.Router();

// router.param('id', tourController.checkID);

// Tour Routes
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
