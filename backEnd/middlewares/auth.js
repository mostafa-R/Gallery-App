const jwt = require("jsonwebtoken");
const jwtHelpers = require("../utils/jwtHelpers");

exports.check = (req, res, next) => {
  let token = req.headers.authorization || req.cookies.jwtToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload) {
      req.userId = payload.sub;
      return next();
    }
  } catch (error) {
    console.error("Error verifying JWT token:", error);
  }

  res.status(401).json({
    message: "Unauthorized!",
  });
};
