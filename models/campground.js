const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
//const methodOverride = require('method-override')
const Review = require('./review')
const Schema = mongoose.Schema

// this is mongoose schema (different from joi schema which is just for validating data during insert or update)

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON:{virtuals:true}, toObject: { virtuals: true },}

const CampgroundSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        price: Number,
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref:'User'
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref:'Review'
            }
        ]
    }, opts
)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>`
});

// mongoose middleware findOneAndDelete to delete all reviews related to the deletd campground
// doc is the deleted document which will be passed to the middleware
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc)
    {
        // remove reviews where review in doc.reviews
        await Review.remove({
            _id: {
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)