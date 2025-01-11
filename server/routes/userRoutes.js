const express = require('express');
//const { getUserProfile } = require('../controllers/userController');
const router = express.Router();
const { fetchQuestion, fetchAff, saveMoodScore, getEvent, addEvent } = require('../controllers/userController');
const { getAnswer } = require('../controllers/userController');

//router.get('/profile', getUserProfile);
router.get('/question' , fetchQuestion);
router.post('/answer' , getAnswer);
router.get('/affirmations' , fetchAff );
router.post('/mood_score' , saveMoodScore)
router.get('/calendar' , getEvent)
router.post('/addEvent' , addEvent)

module.exports = router;
