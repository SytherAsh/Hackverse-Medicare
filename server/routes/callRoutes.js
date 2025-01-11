const express = require('express');
const {createCall} = require('../controllers/callController')
const router = express.Router();

router.post('/',createCall);

module.exports = router;