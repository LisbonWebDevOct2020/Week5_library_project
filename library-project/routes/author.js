const express = require('express');
const router  = express.Router();
const Author = require('../models/Author');

router.get('/authors/create', (req, res) => {
  res.render('author-create');
});

router.post('/authors/create', (req, res) => {
  let { name } = req.body;
  Author.create({
    name
   // bookOwner: req.session.user._id
  }).then(() => {
    res.redirect('/books');
  })
});

module.exports = router;