const router = require("express").Router();
const { NotFoundError } = require("../utils/errors");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { Joi, celebrate } = require("celebrate");

const validateAuth = celebrate({
  body: Joi.object().keus({
    email: Joi.string().required().email().messages,
    passwor: Joi.string().required().messages,
  }),
});

const userRoutes = require("./users");

router.use("/users", userRoutes);
router.use("/items", itemRouter);

router.post("/signin", validateAuth, login);
router.post("/signup", validateAuth, createUser);

router.use((req, res, next) =>
  next(new NotFoundError("Id provided not found"))
);

module.exports = router;
