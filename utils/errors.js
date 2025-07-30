const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const ERROR = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const SERVER_ERROR = 500;

const BadRequestError = require("./BadRequestError");
const UnauthorizedError = require("./UnauthorizedError");
const ForbiddenError = require("./ForbiddenError");
const NotFoundError = require("./NotFoundError");
const ConflictError = require("./ConflictError");

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  ERROR,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT_ERROR,
  SERVER_ERROR,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
