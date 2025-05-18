const express = require('express');
const router = express.Router();
const gameState = require('../../gameState'); // Import the game state module

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Add the player to the list of connected clients
    gameState.players.push(res);
    console.log(`New player connected. Total players: ${gameState.players.length}`);
    // Send initial boss state as HTML
    
    res.write(`event: updateBoss\n`);
    res.write(`data: "Boss Health: ${gameState.boss.health}"\n\n`);

    // Remove the player when the connection is closed
    req.on('close', () => {
        gameState.players.splice(gameState.players.indexOf(res), 1);
        console.log(`Player disconnected. Total players: ${gameState.players.length}`);
    });
});

module.exports = router;