const jwt = require('jsonwebtoken');
const config = require('../config/config');

    const authMiddleware = (req, res, next) => {
      // Get token from header
      const token = req.header('x-auth-token');

      // Check if no token
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      // Verify token
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user;
        next();
      } catch (err) {
        console.log(err)
        res.status(401).json({ msg: 'Token is not valid' });
      }
    };

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    next();
  };
};



module.exports = {
  authMiddleware,authorize
};