const mongosoe = require('mongoose');

const EmailsSchema = new mongosoe.Schema({
    organizationEmail: {
        type: String,
        required: true
    },
    sentDate: {
        type: String,
        default: (new Date).toString()
    }

})

const Emails = mongosoe.model('Emails', EmailsSchema)

module.exports = Emails;