const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { secret } = require("../config/secret");

/**
 * Middleware to verify admin tokens.
 * 1. Check if token exists
 * 2. If no token, send response
 * 3. Decode the token
 * 4. Check if the admin is verified
 * 5. If valid and verified, call next
 */
module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];

    if (!token) {
      return res.status(401).json({
        status: "fail",
        error: "You are not logged in",
      });
    }

    const decoded = await promisify(jwt.verify)(token, secret.token_secret);

    // Check if the admin is verified
    if (decoded.role != "user") {
      return res.status(403).json({
        status: "fail",
        error: "You do not have permission to perform this action",
      });
    }

    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    res.status(403).json({
      status: "fail",
      error: "Invalid token",
    });
  }
};
