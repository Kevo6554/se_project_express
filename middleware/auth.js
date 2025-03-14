const { JWT_SECRET } = require("../utils/config");
const { ERROR } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(new Error("Unauthorized action"));
  }

  const token = authorization.replace("Bearer", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return next(new Error("Unauthorized action"));
  }
  req.user = payload;
  return next();
};
module.exports = auth;
