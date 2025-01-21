const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
// router
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrtictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrtictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrtictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
