// backend/seeder.js
require('dotenv').config();
const mongoose = require('mongoose');
const Memory = require('./models/Memory');
const connectDB = require('./config/db');

connectDB();

const sampleMemories = [
  {
    title: "A Sunny Day",
    text: "I remember a bright sunny day when everything felt possible.",
    emotion: "Inspiring",
    date: "2023-04-08"
  },
  {
    title: "Late Night Laughs",
    text: "Late night conversations with friends always made me laugh.",
    emotion: "Funny"
  },
  {
    title: "Bittersweet Goodbye",
    text: "Some memories are sad and linger like the melody of a forgotten song.",
    emotion: "Sad"
  }
];

const seed = async () => {
  try {
    await Memory.deleteMany();
    await Memory.insertMany(sampleMemories);
    console.log("Sample memories added!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
