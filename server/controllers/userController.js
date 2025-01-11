const Answer = require('../models/Answers'); // Import Answer model
const Question = require('../models/Questions'); // Import Question model
const Affirmation = require('../models/Affirmation'); // Import Affirmation model
const User = require('../models/User'); // Import User model
const MoodLog = require('../models/MoodLogs'); // Import MoodLog model
const Event = require('../models/Event'); // Import Event model
const verifyJWT = require('../middleware/verifyJWT'); // Import the JWT middleware
const axios = require('axios'); // Import axios for making HTTP requests to the Django backend

// Route to fetch questions (public route, no JWT verification needed)
const fetchQuestion = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};

// Route to submit answers (protected route, JWT verification needed)
const getAnswer = async (req, res) => {
    const { answers } = req.body;
    const userId = req.user.id;

    try {
        // Validate answers
        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: 'Invalid answers format' });
        }

        // Save all answers in the database
        const savedAnswers = await Promise.all(
            answers.map(async (answer) => {
                // Convert `option_index` to a number if it's a string
                const optionIndex = Number(answer.option_index);

                // Validate optionIndex before saving
                if (![0, 1, 2, 3].includes(optionIndex)) {
                    return res.status(400).json({ message: `Invalid option_index: ${answer.option_index}` });
                }

                const newAnswer = new Answer({
                    question_id: answer.question_id,
                    option_index: optionIndex,
                    userId: userId,
                });

                return await newAnswer.save();
            })
        );
        return res.status(200).json({ message: 'Answers saved successfully.' });
    } catch (error) {
        console.error("Error saving answers:", error);
        return res.status(500).json({ message: 'Error saving answers.', error: error.message });
    }
};

// Route to fetch a random affirmation (no authentication required)
const fetchAff = async (req, res) => {
    try {
        // Fetch all affirmations from the database
        const affirmations = await Affirmation.find();
    
        // If no affirmations are found
        if (affirmations.length === 0) {
            return res.status(404).json({ message: 'No affirmations found' });
        }
    
        // Randomly pick an affirmation
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    
        // Send the random affirmation as a response
        res.json(randomAffirmation.message);
    } catch (error) {
        console.error("Error fetching affirmations:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to save mood log
const saveMoodLog = async (userId, moodScore, emotionTags, analysisInsights) => {
    const newMoodLog = new MoodLog({
        userId: userId,
        moodScore: moodScore,
        emotionTags: emotionTags,
        analysisInsights: analysisInsights,
    });
    return await newMoodLog.save();
};

// Route to save mood score (protected route, JWT verification needed)
const saveMoodScore = async (req, res) => {
    try {
        const { moodScore } = req.body;
        const userId = req.user.id; // Extract userId from the authenticated request

        // Call saveMoodLog to save the mood log to the database
        const moodLog = await saveMoodLog(userId, moodScore);
        await moodLog.save();
        // Find the user and update the mood score (assuming the user model has a `moodScore` field)
        const user = await User.findById(userId); // Use `findById` to get the user by ID
        user.moodScore = moodScore; // Update the mood score
        await user.save(); // Save the updated user document

        // Send a success response with the saved mood log
        res.status(201).json({ message: 'Mood score saved successfully', moodLog });
    } catch (error) {
        console.error("Error saving mood score:", error);
        res.status(500).json({ error: "Failed to save mood score" });
    }
};

// Route to get events for a user (protected route, JWT verification needed)
const getEvent = async (req, res) => {
    const userId = req.user.id; // Extract userId from the authenticated request
    try {
        const events = await Event.find({ userId: userId }); // Find events for the specific user
        const selectedDate = new Date(); // Optionally, use a specific selected date logic
        res.json({ events, selectedDate  }); // Return events and selectedDate
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// Route to add an event (protected route, JWT verification needed)
const addEvent = async (req, res) => {
    const { title, start, end , mode} = req.body;
    const userId = req.user.id; // Extract userId from the authenticated request
    // Create a new event instance
    const event = new Event({
        userId: userId,
        title,
        start,
        end,
        mode
    });

    try {
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error("Error saving event:", err);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

// Apply verifyJWT middleware to the getAnswer route to ensure only authenticated users can access it
module.exports = { 
    fetchQuestion, 
    getAnswer, 
    fetchAff, 
    saveMoodScore, 
    getEvent, 
    addEvent 
};
