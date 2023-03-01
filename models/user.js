const mongoose = require('mongoose')
const Schema = mongoose.Schema
// passport-local-mongoose is a mongoose plugin
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    }
})

// plugin is basically an extension (software extension). example we add extension in browser.
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)