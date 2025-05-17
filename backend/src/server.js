const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));


const boss = {
    health: 1000, // Boss's initial health
    status: 'alive', // Boss status: 'alive' or 'defeated'
};

const players = []; // List of connected players (SSE clients)

let updatePending = false;

function broadcastBossState() {
        players.forEach(player => player.write(`event: updateBoss\ndata: "Boss Health: ${boss.health}"\n\n`));
}

function scheduleBroadcast() {
    if (!updatePending) {
        updatePending = true;
        setTimeout(() => {
            broadcastBossState();
            updatePending = false;
        }, 100); // Throttle interval in ms
    }
}


app.get('/api/raid', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Add the player to the list of connected clients
    players.push(res);
    console.log(`New player connected. Total players: ${players.length}`);
    // Send initial boss state as HTML
    
    res.write(`event: updateBoss\n`);
    res.write(`data: "Boss Health: ${boss.health}"\n\n`);

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
    }

    scheduleBroadcast();

    res.status(204).end();

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});