let updatePending = false;

function broadcast(gameState, event, data) {
    gameState.players.forEach(player => {
        player.write(`event: ${event}\ndata: ${data}\n\n`);
    });
}

function broadcastBossState(gameState) {
    broadcast(gameState, 'updateBoss', `Boss Health: ${gameState.boss.health}`);
    broadcast(gameState, 'updatePlayer', `Player Health: ${gameState.playerStatus.health}`);
}

function scheduleBroadcast(gameState) {
    if (!updatePending) {
        updatePending = true;
        setTimeout(() => {
            broadcastBossState(gameState);
            updatePending = false;
        }, 100); // Throttle interval in ms
    }
}

module.exports = { broadcast, broadcastBossState, scheduleBroadcast };