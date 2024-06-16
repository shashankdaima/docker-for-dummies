// Import required modules
const express = require('express');
require('dotenv').config()

// Create an Express application
const app = express();

const apiKey = process.env.API_KEY;

// Define a route
app.get('/', (req, res) => {
    res.send(`Hello, world! ${apiKey}`);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});