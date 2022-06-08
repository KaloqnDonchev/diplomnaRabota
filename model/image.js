const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageSource: {type: String},
    emailOfUser: {type: String}
    },
    {
        collection: 'images'
    }
);

const model = mongoose.model('ImageSchema', imageSchema);

module.exports = model;