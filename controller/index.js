const fetch = require("node-fetch")

const Donars = require('../modal/Donars');

module.exports.getIndex = (req, res, next) => {
    res.render('index')
};

module.exports.postSlots = (req, res, next) => {
    let { date, pincode, time } = req.body;
    date = date.substring(8) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
    Donars.find({ distributionDate: date, slot: time, distributionPincode: pincode }).sort({ units: 'desc' })
        .then(donars => {
            res.render('slots', {
                date,
                time,
                pincode,
                donars: donars,
                len: donars.length
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

module.exports.getSlots = (req, res, next) => {
    let { date, pincode, time } = req.params;
    Donars.find({ distributionDate: date, slot: time, distributionPincode: pincode }).sort({ units: 'desc' })
        .then(donars => {
            res.render('slots', {
                date,
                time,
                pincode,
                donars: donars,
                len: donars.length
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

module.exports.postRegister = (req, res, next) => {
    let { date, pincode, time } = req.body;
    res.render('register-donar', { date, pincode, time });
};