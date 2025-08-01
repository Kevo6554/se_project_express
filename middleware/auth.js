const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

function auth(req, res, next) {
  const { authorization } = req.headers; // Get the authorization header from the request

  if (!authorization || !authorization.startsWith("Bearer")) {
    // check if the authorization header from the request
    const error = new Error("Unauthorized");
    error.status = 401; // If not throw an error
    return next(new UnauthorizedError("Unauthorized error"));
  }

  // Extract the toke from the authorizarion header
  const token = authorization.replace("Bearer ", "");
  let payload; // Initialize the payload variable

  // Verify the token
  try {
    payload = jwt.verify(token, JWT_SECRET); // Use the JWT_SECRET to verify the token
  } catch (err) {
    return next(new UnauthorizedError("Unauthorized error"));
  }
  req.user = payload; // Add the payload to the request object

  return next(err); // Pass control to the next middleware function and return
}

module.exports = auth;
