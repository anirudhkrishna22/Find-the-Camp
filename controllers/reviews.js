const Campground = require('../models/campground.js')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
   console.log(campground)
    const review = new Review(req.body.review)
    review.author=req.user._id
   campground.reviews.push(review)
   await review.save()
    await campground.save()
    req.flash('success', 'created new review')
   res.redirect(`/campgrounds/${campground._id}`)
   
   //console.log(campground.reviews[body])
   //res.send('hi')
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
     await Review.findByIdAndDelete(reviewId)
     req.flash('success', 'deleted the review')
    res.redirect(`/campgrounds/${id}`)
 }