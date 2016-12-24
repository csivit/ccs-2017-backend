var config = require('../config.js');
var jwt = require('jsonwebtoken');

var checkUser = function (req, res, next) {
  var token = req.get("authorization");
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.user = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}

var isAdmin = function (req, res, next) {
  checkUser(req, res, function () {
    if (config.adminEmails.indexOf(req.user.email) > -1) {
      next();
    } else {
      return res.json({
        success: false,
        message: 'Your are not an admin'
      });
    }
  })
}

module.exports = {
  checkUser: checkUser,
  isAdmin: isAdmin
}