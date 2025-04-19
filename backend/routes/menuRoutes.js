const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

console.log('menuRoutes.js loaded, setting up routes...');

// Route to fetch all menu items
router.get('/', (req, res) => {
  console.log('Received GET request to /api/menu in menuRoutes.js');
  menuController.getMenuItems(req, res);
});

module.exports = router;