const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    expires: { type: Date, required: true, minlength: 6 },
    session: { type: String, required: true },
});

module.exports = mongoose.model('Session', sessionSchema);