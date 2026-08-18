const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    imageUrl: {
        type: String,
        default: ""
    },

    contentUrl: {
        type: String,
        required: true,
        trim: true
    },

    views: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Content", contentSchema);