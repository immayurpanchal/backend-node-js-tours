const express = require('express');
const tourController = require('../controllers/tourController');
const authContrller = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

// Tour Router
const router = express.Router();

// router.param('id', tourController.checkID);

// Review routes
router.use('/:tourId/reviews', reviewRouter);

// Tour Routes
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authContrller.protect,
    authContrller.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

/* 
QueryString: /tours-within?distance=2000=&center=-40,45&unit=mi
1. /tours-within/200/center/-40,45/unit/mi
2. /tours-within/200/center/-40,45/unit/km
*/

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authContrller.protect,
    authContrller.restrictTo('lead-guide', 'admin'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authContrller.protect,
    authContrller.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authContrller.protect,
    authContrller.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// POST /tour/:id/reviews -> Create a given tour review
// GET /tour/:id/reviews -> Get reviews for given tour id
// GET /tour/:id/review/:rid -> Get specific review details

module.exports = router;
