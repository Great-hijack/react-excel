const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FileSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    saved_url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: true
    },
    register_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = File = mongoose.model("File", FileSchema, "File");