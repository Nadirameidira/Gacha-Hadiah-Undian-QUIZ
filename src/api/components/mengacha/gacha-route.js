const express = require('express');
const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha', route);

  route.post('/spin', gachaController.spin);
  route.get('/history/:id', gachaController.history);
  route.get('/quota', gachaController.quota);
  route.get('/winners', gachaController.winners);
};
// 0066
