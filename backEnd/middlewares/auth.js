// const jwtHelpers = require("../utils/jwtHelpers");

// exports.check = (req, res, next) => {
//   let token = req.headers["cookie"];

//   if (!token || !token.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized!" });
//   }

//   token = token.replace("Bearer", "").trim();

//   const payload = jwtHelpers.verify(token);

//   if (payload) {
//     req.userId = payload.sub;
//     return next();
//   }

//   res.status(401).json({
//     message: "Unauthorized!",
//   });
// };

// exports.check = (req, res, next) => {
//   //let token = req.cookies.jwtToken; // Get the JWT token from cookies

//   const token = req.headers.authorization || req.cookies.jwtToken;
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized!" });
//   }

//   const payload = jwtHelpers.verify(token);

//   if (payload) {
//     req.userId = payload.sub;
//     return next();
//   }

//   res.status(401).json({
//     message: "Unauthorized!",
//   });
// };


const jwt = require('jsonwebtoken');
const jwtHelpers = require('../utils/jwtHelpers');

exports.check = (req, res, next) => {
  // let token = req.headers.authorization || req.cookies.jwtToken; 
  let token = req.headers.authorization || req.cookies.jwtToken; // Get the JWT token from headers or cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  if (token.startsWith('Bearer ')) {
    // Remove the 'Bearer ' prefix from the token
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