require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/memories', require('./routes/memories'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
