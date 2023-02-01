const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const elementSchema = new Schema({
    name: {
        type: String,
        required: true

    },
    materials: [{
        name: String,
        GWP: Number,
        //required: true
    }]

});

const Element = mongoose.model('Element', elementSchema, 'Elements');
module.exports = Element;