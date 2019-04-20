var express = require('express');
var router = express.Router();

const User = require('../models/User');
const withAuth = require('./middleware');

router.post('/register', withAuth, function (req, res) {
  const { name, email, password } = req.body
  const user = new User({ name, email, password })

  user.save(function (err) {
    if (err) {
      res.status(500)
        .send("Error registering new user please try again.");
    } else {
      res.status(201).end()
    }
  })
});

module.exports = router;
