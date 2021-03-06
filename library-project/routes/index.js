const express = require('express');
const app = require('../app');
const router  = express.Router();

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next(); // allow the next route to run
  } else {
    res.redirect('/login');
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  req.app.locals.loggedUser = req.session.currentUser;
  res.render('index', { user: req.session.currentUser });
});

router.get('/private', requireLogin, (req, res) => {
  res.render('private');
});

router.get('/main', (req, res) => {
  res.render('main');
});

module.exports = router;
