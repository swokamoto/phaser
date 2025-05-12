const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    res.write('data: Connection established\n\n');

    let counter = 1;

    const interval = setInterval(() => {
        const html = `<ul><li>Item #${counter}</li></ul>`;
        res.write(`event: inventoryUpdate\n`);
        res.write(`data: ${html}\n\n`);
        counter++;
    }, 3000);
    
    req.on('close', () => clearInterval(interval));
});


const boss = {
    health: 1000, // Boss's initial health
    status: 'alive', // Boss status: 'alive' or 'defeated'
};

const players = []; // List of connected players (SSE clients)

app.get('/api/raid', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Add the player to the list of connected clients
    players.push(res);
    console.log(`New player connected. Total players: ${players.length}`);
    // Send initial boss state as HTML
    const html = `
      <p id="boss-health">Boss Health: ${boss.health}</p>
      <p id="boss-status">Boss Status: ${boss.status}</p>
    `;
    res.write(`data: ${html}\n\n`);

    // Remove the player when the connection is closed
    req.on('close', () => {
        players.splice(players.indexOf(res), 1);
        console.log(`Player disconnected. Total players: ${players.length}`);
    });
});

app.post('/api/attack', (req, res) => {
    console.log(req.body); // Log the incoming request body
    console.log(boss.health); // Log the boss's health
    console.log(boss.status); // Log the boss's status
    const damage = parseInt(req.body.damage, 10) || 10; // Damage dealt by the player
    console.log(damage); // Log the damage dealt
    if (boss.status === 'alive') {
        boss.health -= damage;
        console.log(boss.health); // Log the boss's health after damage
        // Check if the boss is defeated
        if (boss.health <= 0) {
            boss.health = 0;
            boss.status = 'defeated';
        }

        // Send HTML response to the client
        res.status(200).send(`
        <p id="boss-health">Boss Health: ${boss.health}</p>
        <p id="boss-status">Boss Status: ${boss.status}</p>
        `);
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});