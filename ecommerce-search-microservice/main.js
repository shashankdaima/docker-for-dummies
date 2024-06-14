// Import required modules
const express = require('express');
const redis = require('redis');
const postgres = require('postgres');
require('dotenv').config();

// Create an Express application
const app = express();

app.use(express.json());

// Create a Redis client instance
const redisClient = redis.createClient(
    {
        url: process.env.REDIS_URL
    }
);
redisClient.on('error', err => console.error('Redis Client Error', err));
//Create a Postgres client instance.

const sql = postgres({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});

// will use psql environment variables

// Define a route
app.get('/search', async (req, res) => {
    try {
        const results = await getSearchResults(req.query.q);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving search results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const getSearchResults = async (q) => {
    // Check if the key exists in Redis

    const exists = await redisClient.exists(q);
    if (exists) {
        const result = await redisClient.get(q);
        return {
            source: "redis",
            result: JSON.parse(result) // Assuming stored as JSON string
        };
    } else {
        // Simulate some expensive operation to generate results
        const searchResults = await performExpensiveSearchOperation(q);

        // Store the results in Redis for future use
        await redisClient.set(q, JSON.stringify(searchResults), { EX: 60 }); // Store for 1 minute (60 seconds)

        return {
            source: "database", // or any other source
            result: searchResults
        };
    }
}

// Simulated expensive search operation
// Perform the actual search operation in the database
async function performExpensiveSearchOperation(query) {
    try {
        const res = await sql`SELECT * FROM products WHERE product_name ILIKE ${'%' + query + '%'}`;
        return res;
    } catch (error) {
        console.error('Error performing search operation:', error);
        return [];
    }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await redisClient.connect();
    // await client.connect()
    console.log(`Server is running on port ${PORT}`);
});
