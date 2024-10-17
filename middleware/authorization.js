module.exports = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Ensure this matches what you set in the token
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        status: "fail",
        error: "You are not authorized to access this",
      });
    }

    next();
  };
};
