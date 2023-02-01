const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lockSchema = new Schema({},{ timestamps: true });

const Lock = mongoose.model('Lock', lockSchema, 'Lock');
module.exports = Lock;