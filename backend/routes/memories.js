const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllMemories,
  getUserMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  addComment,
  deleteComment,
  toggleLike
} = require('../controllers/memoryController');

// Memory routes
router.get('/', getAllMemories);
router.get('/me', auth, getUserMemories);
router.post('/', auth, createMemory);
router.put('/:id', auth, updateMemory);
router.delete('/:id', auth, deleteMemory);

// Comment routes
router.post('/:id/comments', auth, addComment);
router.delete('/:id/comments/:commentId', auth, deleteComment);

// Like routes
router.post('/:id/like', auth, toggleLike);

module.exports = router;
