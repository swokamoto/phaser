const express = require('express');
const cors = require('cors');
const routes = require('./controllers/index');
const gameState = require('./gameState'); // Import the game state module

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});