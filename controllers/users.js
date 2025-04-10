const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  OK,
  ERROR,
  CREATED,
  CONFLICT_ERROR,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Inavalid data provided" });
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
        return res
          .status(ERROR)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data provided" });
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
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "User already exist" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const getUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Id provided was not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    //prepare the update
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    // Update the user
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).orFail();

    // Exclude the password
    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.status(OK).send({ data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return next(new NOT_FOUND("User not found"));
    }
    if (err.name === "ValidationError") {
      return next(new BAD_REQUEST("User not found"));
    }
    return next(err);
  }
};

module.exports = { getUser, createUser, login, updateUser };
