const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const { string } = require('joi');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2'); //adding paginate functionality


const ImageSchema = new Schema({
    url: String,
    filename: String,

});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_100')
});

ImageSchema.virtual('indexImage').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_250,w_400')
});

// c_pad,h_200,w_200

ImageSchema.virtual('showImage').get(function () {
    return this.url.replace('/upload', '/upload/c_scale,h_450,w_450')
});


const opts = { toJSON: {virtuals: true }};

const CampgroundSchema = new Schema({
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
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href='campgrounds/${this._id}'>${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.plugin(mongoosePaginate); //adding paginate functionality

module.exports = mongoose.model('Campground', CampgroundSchema); 