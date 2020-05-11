const mongosoe = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OrganizationsSchema = new mongosoe.Schema({
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
    organizationPincode: {
        type: Number,
        required: true
    },
    organizationAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verificationKey: {
        type: String,
        default: uuidv4()
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    addedDate: {
        type: String,
        default: (new Date).toString()
    }

})

const Organizations = mongosoe.model('Organizations', OrganizationsSchema)

module.exports = Organizations;