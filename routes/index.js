var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user.js');
var config = require('../config.js');
var auth = require('./auth.js');


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/signup', function (req, res, next) {
  console.log(req.body.email);
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      res.json({
        success: false,
        error: "Database Error"
      });
    }
    if (user) {
      res.json({
        success: false,
        error: "User already exists"
      });
    } else {
      var newUser = new User(req.body);

      newUser.save(function (err, user) {
        if (err)
          console.log(err);
        var payload = {
          id: user._id
        };
        var token = jwt.sign(payload, config.secret);
        res.json({
          success: true,
          token: token
        })
      });
    }
  });
});

router.post('/login', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    email: email
  }, function (err, user) {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error"
      });
    }
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User doesn't exsits"
      });
    } else {
      user.comparePassword(password, function (err, correct) {
        if (!correct) {
          res.status(422).json({
            success: false,
            message: "Wrong Password"
          })
        } else {
          var payload = {
            id: user._id
          };
          var token = jwt.sign(payload, config.secret);
          res.json({
            success: true,
            token: token,
            message: "Login Succesful"
          });
        }
      })

    }
  });
});





router.post('/checkEmail', function (req, res) {
  var email = req.body.email;
  User.findOne({
    email: email
  }, function (err, user) {
    if (user) {
      res.json({
        firstTime: false,
        email: email
      });
    } else {
      res.json({
        firstTime: true,
        email: email
      });
    }
  })
})
module.exports = router;