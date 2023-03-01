const ExpressError = require('./utils/expressError')
const Campground = require('./models/campground.js')
//const joi = require('joi') // joi is a popular module for data/schema validation
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Review = require('./models/review.js')

module.exports.isLoggedin = (req, res, next) => {
    // this function in passport checks whether a user is logged in or not. similar to using session to find out that.
    if (!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be logged in')
        return res.redirect('/login')
    }   
    next()
}

// middleware for validating schema constraints for a data
module.exports.validateCampground = (req, res, next) => {
    // defining joi schema
    // even in case we passed client side validation, this server side validation will give error
    
    // validating data through joi
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el=>el.message).join(',') // this is just syntax for printing detatils from an array of objects
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    // defining joi schema
    // even in case we passed client side validation, this server side validation will give error
    
    // validating data through joi
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el=>el.message).join(',') // this is just syntax for printing detatils from an array of objects
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}