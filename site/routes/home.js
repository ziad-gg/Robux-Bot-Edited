const express = require('express');
const client = require('../../index.js');
const pages = require('../config.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../auth/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', {
    home: pages.home,
    title: client.user.username + ' | ' + 'dashboard',
    client,
    user: req.user
  });
})

router.get('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/login');
});

module.exports = router;