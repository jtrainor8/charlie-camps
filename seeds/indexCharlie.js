const mongoose = require('mongoose');
const { stops } = require('./trip.js');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/charlie-camps', {
    useNewUrlParser: true,
    // useCreateIndex: true,    **no longer supported
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
            author: '65fdff88f6e7eef74d02b3d7',
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

