const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the current book tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ['card'],
      /* success_url: `${req.protocol}://${req.get('host')}/?tour=${
        req.params.tourId
      }&user=${req.user.id}&price=${tour.price}`, */
      success_url: `http://localhost:3000/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${
        req.params.tourId
      }`,
      customer_email: req.user.email,
      // Custom fields: client_reference_id: allows to pass some data
      // about the purchase of the data, we'll access the session object again
      client_reference_id: req.params.tourId,
      line_items: [
        {
          name: `${tour.name} Tour`,
          description: tour.summary,
          // images require from live server so we'll do it after deployment
          images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          amount: tour.price * 100, // price is in cents
          currency: 'inr',
          quantity: 1
        }
      ]
    },
    { apiKey: process.env.STRIPE_SECRET_KEY }
  );

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);