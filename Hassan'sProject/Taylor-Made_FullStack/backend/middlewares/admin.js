const adminMiddleware = (req, res, next) => {
  console.log('Checking admin status for user:', req.user._id);

  if (req.user && req.user.isAdmin) {
    console.log('User is an admin:', req.user._id);
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin access required' });
  }
};

module.exports = adminMiddleware;
