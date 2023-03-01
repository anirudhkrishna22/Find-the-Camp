if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

const ejsMate = require('ejs-mate')

//const joi = require('joi') // joi is a popular module for data/schema validation
const {campgroundSchema, reviewSchema} = require('./schemas.js')

const ExpressError = require('./utils/expressError')

const methodOverride = require('method-override')

const path = require('path')

const Campground = require('./models/campground.js')
const Review = require('./models/review.js');

const passport = require('passport')
const LocalStrtegy = require('passport-local')
const User = require('./models/user')

//const campground = require('./models/campground.js');

// requiring routes files
const userRoutes = require('./routes/users.js')
const campgroundRoutes = require('./routes/campgrounds.js')
const reviewRoutes = require('./routes/reviews.js')

const flash=require('connect-flash')
const session = require('express-session')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=> {
    console.log('mongo database connected!!!')
    })
    .catch((err) => {
        console.log('error occured in mongo connection!!!')
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
//app.use(express.bodyParser());

// something for method override.
// in the form, in action, query string should be '_method' to override
app.use(methodOverride('_method'))  

app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7, // Date.now() returns time in milliseconds. to set it expire in 1 week time we added number of milliseconds in 1 week
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
// telling passport to use local strategy. authentication method will be located on use model called authenticate
passport.use(new LocalStrtegy(User.authenticate()))

// serialization refers to how do we get data or how do we store a user in the session
passport.serializeUser(User.serializeUser());
// how to get a user out of the session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //console.log(req.session.returnTo)
    res.locals.currentUser=req.user // currentUser will be available in all files
    res.locals.success = req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes) // by default we wont have access to id in reviews, so we write mergeParams to true in router in reviews.js

app.get('/', (req, res) => {
    res.render('home.ejs')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err){
        err.message='something went wrong'
    }
    res.status(status).render('error.ejs', {err})
})

app.listen(3000, () => {
    console.log('app is listening on port 3000')
})