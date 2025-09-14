const express = require('express');
const cors = require('cors');
require('dotenv').config();

const blogRoutes = require('./routes/blogs');
const categoryRoutes = require('./routes/categories');
const geminiRoutes = require('./routes/gemini');  // ✅ Add this line

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gemini', geminiRoutes);  // ✅ Now this works

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Startup Blog API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
