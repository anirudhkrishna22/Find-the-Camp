// this file is for reviews routes
// that is, all routes that start with /campgrounds/:id/reviews
const express = require('express')
// routers get separate params, so we give mergeParams to true in router
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync') //class for handling error
const Campground = require('../models/campground.js')
const Review = require('../models/review.js')
const ExpressError = require('../utils/expressError')
const { campgroundSchema, reviewSchema } = require('../schemas.js')
const { validateReview, isLoggedin, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews.js')

router.post('/', isLoggedin, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router