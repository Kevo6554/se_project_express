const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  NotFoundError,
  BadRequestError,
  OK,
  UnauthorizedError,
  CREATED,
  ConflictError,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Invalid data provided");
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(BadRequestError("Invalid data provided"));
  }

  // check if the user exists
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Duplicated");
        error.code = 11000;
        throw error;
      }
      return bcrypt.hashSync(password, 10);
      // hash the password
    })
    .then((hash) => User.create({ name, avatar, email, password: hash })) // create the user with the hashed password
    .then((user) => {
      const responseUser = user.toObject(); // convert user
      delete responseUser.password; // omit the password hash
      res.status(CREATED).send(responseUser); // send the user without the password
    })
    .catch((err) => {
      console.log(">>>", err);
      if (err.name === "ValidationError") {
        return next(BadRequestError("Invalid data provided"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("Email is already in use"));
      }
      return next(err);
    });
};

const getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Id provided not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
    });
};

const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    // prepare the update
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    // Update the user
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).orFail();

    // Exclude the password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return res.status(OK).send({ data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Id provided not found"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided"));
    }
    return next(err);
  }
};

module.exports = { getUser, createUser, login, updateUser };
