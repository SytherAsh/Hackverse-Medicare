const express = require('express');
const {sendEventConfirmationEmail} = require('../controllers/emailController');
const router = express.Router();

router.post('/',sendEventConfirmationEmail);

module.exports = router;