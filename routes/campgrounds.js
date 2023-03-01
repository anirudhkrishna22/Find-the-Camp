const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync') //class for handling error
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground.js')
const campgrounds = require('../controllers/campgrounds')
//const joi = require('joi') // joi is a popular module for data/schema validation
const { campgroundSchema } = require('../schemas.js')
const { isLoggedin, isAuthor, validateCampground } = require('../middleware.js')

// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const multer = require('multer')
const {storage} = require('../cloudinary') // we defined storage in cloudinary/index.js. we dont need to type/index.js as node automatically looks for index.js
const upload = multer({ storage }) // destination folder to upload the files


router.route('/')
    // catchAsync is the wrrouterer function which we defined in catchAsync.js
    .get(catchAsync(campgrounds.index))
    .post(isLoggedin, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

    // upload.array is a middleware. array is for multiple files otherwise single
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files)
    //     res.send('worked')
    // })

router.get('/new', isLoggedin, campgrounds.renderNewForm)

router.route('/:id')
    // route to find and show
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.renderEditForm))


module.exports = router