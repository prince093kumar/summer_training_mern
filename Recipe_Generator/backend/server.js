const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const cors = require("cors");
const recipeRoutes = require('./routes/recipe.routes');
const groceryRoutes = require('./routes/grocery.routes');
const axios = require("axios");
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Database connected");
}).catch(() => {
  console.log("Error connecting database");
});


app.use(cors());

app.use(express.json())
  .use('/auth', authRoutes)
  .use('/user',  userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.use('/recipes', recipeRoutes);
app.use('/grocery', groceryRoutes);
app.get("/api/suggest/recipes", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        params: {
          query,
          number: 6,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});