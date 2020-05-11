const express = require('express');

const { ensureAuthenticated } = require('../config/auth')
const indexController = require('../controller/index');


const router = express.Router();

router.get('/', indexController.getIndex);
router.get('/slots/:pincode/:date/:time', indexController.getSlots);
router.post('/slots', indexController.postSlots);
router.post('/slots/register', indexController.postRegister);

module.exports = router;