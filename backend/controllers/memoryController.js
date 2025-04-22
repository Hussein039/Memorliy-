const Memory = require('../models/Memory');
const User = require('../models/User');

exports.getAllMemories = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    console.error('Error fetching memories:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    console.error('Error fetching user memories:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMemory = async (req, res) => {
  try {
    const { text, emotion } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    const newMemory = await Memory.create({ 
      text, 
      emotion: emotion || 'Mysterious', // Default emotion if none provided
      userId: req.user.id 
    });
    
    res.status(201).json(newMemory);
  } catch (err) {
    console.error('Error creating memory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    
    if (memory.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    memory.text = req.body.text || memory.text;
    memory.emotion = req.body.emotion || memory.emotion;
    await memory.save();
    
    res.json(memory);
  } catch (err) {
    console.error('Error updating memory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    
    if (memory.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Memory.deleteOne({ _id: req.params.id });
    res.json({ message: 'Memory deleted' });
  } catch (err) {
    console.error('Error deleting memory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Comment functionality
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newComment = {
      text,
      userId: req.user.id,
      username: user.username,
      createdAt: Date.now()
    };
    
    memory.comments.push(newComment);
    await memory.save();
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    
    const comment = memory.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.userId.toString() !== req.user.id && memory.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    memory.comments.pull(req.params.commentId);
    await memory.save();
    
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like functionality
exports.toggleLike = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    
    const userLiked = memory.likes.includes(req.user.id);
    
    if (userLiked) {
      // Unlike
      memory.likes = memory.likes.filter(id => id.toString() !== req.user.id);
    } else {
      // Like
      memory.likes.push(req.user.id);
    }
    
    await memory.save();
    
    res.json({ likes: memory.likes.length, userLiked: !userLiked });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
