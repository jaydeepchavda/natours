const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// route ------------------------------------

const router = express.Router();

// router.param('id', tourController.checkID)

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect, 
        authController.restrtictTo('admin','lead-guide','guide'), 
        tourController.getMonthlyPlan
    );

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect, 
        authController.restrtictTo('admin','lead-guuide'), 
        tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect, 
        authController.restrtictTo('admin','lead-guide'),
        tourController.updateTour)
    .delete(
        authController.protect, 
        authController.restrtictTo('admin','lead-guide'), 
        tourController.deleteTour);
// issue solved 
// router
//     .route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restrtictTo('user'),
//         reviewController.createReview
//     )

module.exports = router;