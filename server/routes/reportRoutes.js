const express = require('express');
const router = express.Router();
const { sendWeeklyReportEmail } = require('../controllers/reportControllers');

// Test route for sending summary email
router.post('/', async (req, res) => {
  try {
    // Mock user data and summary data from the request body
    const user = { email: req.body.email };  // Use the email you want to test
    const reportData = req.body.summary;

    // Call the email sending function
    await sendWeeklyReportEmail({ user, reportData });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;