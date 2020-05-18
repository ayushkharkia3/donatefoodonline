const mongosoe = require('mongoose');

const Schema = mongosoe.Schema;

const DonarsSchema = new mongosoe.Schema({
    organizationName: {
        type: String,
        required: true
    },
    organizationEmail: {
        type: String,
        required: true
    },
    organizationContact: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        required: true
    },
    distributionDate: {
        type: String,
        required: true
    },
    distributionPincode: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    distributionPlaces: {
        type: String,
        required: true
    },
    originalDate: {
        type: Date,
        required: true
    },
    addedDate: {
        type: String,
        default: (new Date).toString()
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Organizations',
        required: true
    }

})

const Donars = mongosoe.model('Donars', DonarsSchema)

module.exports = Donars;