const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  // Get a single tour reviews if tourId is given
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id; // req.user getting from protect middleware

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});

exports.deleteReview = factory.deleteOne(Review);