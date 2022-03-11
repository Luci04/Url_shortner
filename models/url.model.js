const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ShrotUrlSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    shortId: {
        type: String,
        required: true
    }
})

const Shorturl = mongoose.model('shortUrl', ShrotUrlSchema)

module.exports = Shorturl;