const express = require('express')
const router = express.Router();

const playerRoutes = require('./playerRoutes');
const raidRoutes = require('./raidRoutes');

router.use('/player', playerRoutes);
router.use('/raid', raidRoutes);

module.exports = router;