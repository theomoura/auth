const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const withAuth = require('./middleware');

dotenv.config()
const secret = process.env.SECRET

/* GET home page. */
router.get('/home', withAuth, function (req, res) {
  res.send("Welcome")
});

router.get('/secret', withAuth, function (req, res) {
  res.send("Scret page here")
});

router.post('/authenticate', function (req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(password, function (err) {
        if (err) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
            });
        } else {
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true })
            .status(200).send('token');
        }
      });
    }
  });
});

router.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
})


module.exports = router;
