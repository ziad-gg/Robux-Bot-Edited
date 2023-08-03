const express = require('express');
const passport = require('passport');

const client = require('../../index.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../auth/auth');

const router = express.Router();

router.get('/api', forwardAuthenticated, (req, res, next) => {
  passport.authenticate('discord', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
})

module.exports = router;