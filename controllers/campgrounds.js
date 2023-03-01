const Campground = require('../models/campground.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken:mapBoxToken})
const cloudinary = require('../cloudinary').v2;

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', {campgrounds})
}


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs')
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground)
    //     throw new ExpressError('invalid campground data', 400) // customising the error message and status code
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send()
    
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f=>({url:f.path, filename:f.filename}))
    campground.author = req.user._id
    await campground.save()
    console.log(campground)
    req.flash('success', 'successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    // if there is an attribute in one collection which is a reference then when we display the table this attribute value will be the referenced id. if we want the entire data present in that id in the referenced table then we include .populate
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author') // populate function in mongoose will display the entire data in that particular id referenced in another table instead of just displaying the id
    // if there is no campground then flash an error msg and redirect to /campground
    if (!campground) {
        req.flash('error', 'cannot find that campground')
        return res.redirect('/campgrounds')
    }
    console.log(campground)
    res.render('campgrounds/show', {campground})
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    console.log(campground)
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        // query to delete an image from mongodb
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'deleted the campground')
    res.redirect('/campgrounds')

}