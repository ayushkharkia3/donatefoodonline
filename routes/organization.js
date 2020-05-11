const express = require('express');

const { ensureAuthenticated } = require('../config/auth')
const organizationController = require('../controller/organization');


const router = express.Router();

router.get('/register', organizationController.getRegister);
router.get('/login', organizationController.getLogin);
router.post('/register', organizationController.postRegister);
router.post('/login', organizationController.postLogin);
router.get('/forgotpassword', organizationController.getForgotPassword);
router.post('/forgotpassword', organizationController.postForgotPassword);
router.get('/email/:key/verify', organizationController.getVerifyEmail);
router.get('/forgot/:key/reset', organizationController.getUpdatePassword);
router.post('/updatepassword', organizationController.postUpdatePassword);
router.get('/dashboard', ensureAuthenticated, organizationController.getDashboard);
router.get('/donate', ensureAuthenticated, organizationController.getDonate);
router.post("/donate/:distributionPlaces/:distributionDate/:distributionPincode/:slot/:units/:captcharesponse/", ensureAuthenticated, organizationController.postDonate);
router.get('/logout', organizationController.getLogout);

module.exports = router;