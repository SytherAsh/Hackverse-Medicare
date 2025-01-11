// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const verifyJWT = require('../middleware/verifyJWT');

// Create a new journal
router.post('/', verifyJWT, async (req, res) => {
  try {
    const { title, content, mood, tags, images, isPrivate, location, weather, activities } = req.body;
    const userId = req.user.id; // Assuming verifyJWT middleware adds user data

    const newJournal = new Journal({
      userId,
      title,
      content,
      mood,
      tags,
      images,
      isPrivate,
      location,
      weather,
      activities,
    });

    await newJournal.save();

    res.status(201).json({
      message: 'Journal created successfully',
      journal: newJournal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating journal' });
  }
});

// Update an existing journal by ID
router.put('/:id', verifyJWT, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Check if the logged-in user is the owner of the journal
    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this journal' });
    }

    const updatedData = req.body;

    // Update journal fields
    Object.assign(journal, updatedData);

    await journal.save();

    res.status(200).json({
      message: 'Journal updated successfully',
      journal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating journal' });
  }
});

// Get all journals for the authenticated user
router.get('/', verifyJWT, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id });
    res.status(200).json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching journals' });
  }
});

// Get a specific journal by ID
router.get('/:id', verifyJWT, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Check if the logged-in user is the owner of the journal
    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to view this journal' });
    }

    res.status(200).json(journal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching journal' });
  }
});

// Delete a journal by ID
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Check if the logged-in user is the owner of the journal
    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this journal' });
    }

    await journal.remove();

    res.status(200).json({
      message: 'Journal deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting journal' });
  }
});

module.exports = router;