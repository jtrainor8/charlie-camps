if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const { stops } = require('./trip.js');
const Campground = require('../models/campground');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL;
const secret = process.env.SECRET;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<stops.length; i++) {
        const camp = new Campground({
            author: '6601d100bf23984ce5430326',
            location:`${stops[i].State}, ${stops[i].City}`,
            title: `${stops[i].Title}`,
            description: `${stops[i].Description}`, 
            geometry: {
            type: "Point",
            coordinates: [stops[i].Longitude, stops[i].Latitude]
            },
            price: stops[i].Price,
            images: stops[i].Images,
        })
        await camp.save();
    }
    
}

seedDb().then(() =>{
    mongoose.connection.close();
})

