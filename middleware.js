const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const admin = process.env.ADMIN;

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// module.exports.validateCampground = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

module.exports.validateUpdateCampground = (req, res, next) => {
    const { id } = req.params;
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        req.flash('error', `Please make sure all fields are valid inputs when updating!`);
        return res.redirect(`/campgrounds/${id}`)
    } else {
        next();
    }
}

module.exports.validateNewCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        req.flash('error', `Please make sure all fields are valid inputs!`);
        return res.redirect(`/campgrounds/new`)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id) && !req.user._id.equals(admin)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id) && !req.user._id.equals(admin)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}