const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");

// Generate access token for user authentication
exports.generateToken = (userInfo) => {
  const payload = {
    _id: userInfo._id,
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role,
  };

  const token = jwt.sign(payload, secret.token_secret, {
    expiresIn: "2d", // Token expiration time
  });

  return token;
};

// Generate token for email verification
exports.tokenForVerify = (user) => {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  return jwt.sign(payload, secret.jwt_secret_for_verify, {
    expiresIn: "10m", // Shorter expiration for verification
  });
};
