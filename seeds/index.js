const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

const path = require('path')

const {places, descriptors} = require('./seedHelpers.js')
const Campground = require('../models/campground')  //requiring campground.js to create a model
const cities = require('./cities')  // cities contain array of seed data which is exported and required here

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=> {
    console.log('mongo database connected!!!')
    })
    .catch((err) => {
        console.log('error occured in mongo connection!!!')
        console.log(err)
    })

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

// inserting seed data
const seedDB = async () => {
    await Campground.deleteMany({})
    // const c = Campground({ title: 'purple field' })
    // await c.save()
    for (let i = 0; i < 300; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground(
            {
                author:'63f22ce6d03aeefd200a08c3',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: 'some description for this location',
                price: price,
                geometry:
                {
                    type: 'Point',
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ]
                },
                images : [
                    {
                      url: 'https://res.cloudinary.com/dhvy851s3/image/upload/v1676959469/YelpCamp/m1yhrsuefgkr27osazie.jpg',
                      filename: 'YelpCamp/m1yhrsuefgkr27osazie',
                    },
                    {
                      url: 'https://res.cloudinary.com/dhvy851s3/image/upload/v1676959470/YelpCamp/z2x2ej3bex5qxrw5oeqg.jpg',
                      filename: 'YelpCamp/z2x2ej3bex5qxrw5oeqg',
                    }
                  ]
            }
        )
        await camp.save()
        }
}

seedDB().then(() => {
    mongoose.connection.close() // this is how we close connection with database
})