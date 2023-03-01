const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model("Review", reviewSchema)