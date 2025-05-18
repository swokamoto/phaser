const express = require('express');
const router = express.Router();
const gameState = require('../../gameState'); // Import the game state module
const { scheduleBroadcast } = require('../../utils/broadcast'); // Import the broadcast function

router.post('/attack', (req, res) => {
    const damage = parseInt(req.body.damage, 10) || 10; // Damage dealt by the player
    if (gameState.boss.status === 'alive') {
        gameState.boss.health -= damage;
        // Check if the boss is defeated
        if (gameState.boss.health <= 0) {
            gameState.boss.health = 0;
            gameState.boss.status = 'defeated';
        }
    }

    scheduleBroadcast(gameState);
    res.status(204).end();
});

module.exports = router;