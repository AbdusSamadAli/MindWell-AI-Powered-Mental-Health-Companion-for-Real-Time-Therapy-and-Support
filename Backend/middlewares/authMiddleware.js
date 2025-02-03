const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  
  console.log('Received token:', token);
  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;  // Make sure user is assigned to req.user
    console.log('Authenticated user:', req.user);  // Debugging line
    next();  
  });
};

module.exports = authenticateUser;
