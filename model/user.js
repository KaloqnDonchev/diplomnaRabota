const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true, minLength: 6}
    },
    {
        collection: 'users'
    }
);

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;