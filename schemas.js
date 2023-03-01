// this file contains just the schema to validate data before inserting or updating to the database
// joi is a popular module for data/schema validation
const { number } = require('joi')
const joi = require('joi')

const campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        //image: joi.string().required(),
        location: joi.string().required(),
        description:joi.string().required()
    }).required(),

    deleteImages:joi.array()
})

module.exports.campgroundSchema = campgroundSchema

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body:joi.string().required()
        
    }).required()
})