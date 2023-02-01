const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const buildingSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    thickness: {
        type: Number,
        required: true,
    },
    footing: {
        type: Number,
        required: true,
    },
    interior: {
        type: Number,
        required: true,
    },
    stairs: {
        type: Number,
        required: true,
    },
    exterior: {
        type: Number,
        required: true,
    },
    slab: {
        type: Number,
        required: true,
    },
    roof: {
        type: Number,
        required: true,
    },
    window: {
        type: Number,
        required: true,
    },
    door: {
        type: Number,
        required: true,
    },
    blueprint: {
        type: String,
        required: true,
    },
    }
)

const Building = mongoose.model('Building', buildingSchema, 'Buildings');
module.exports = Building;