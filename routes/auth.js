var config = require('../config.js');
var jwt = require('jsonwebtoken');
module.exports = {
checkUser : function(req, res, next) {
  var token = req.get("authorization");
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
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
}
