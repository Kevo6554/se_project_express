const router = require("express").Router();
const { NotFoundError } = require("../utils/errors");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

const { validateAuth, validateUserBody } = require("../middleware/validation");

const userRoutes = require("./users");

router.use("/users", userRoutes);
router.use("/items", itemRouter);

router.post("/signin", validateAuth, login);
router.post("/signup", validateUserBody, createUser);

router.use((req, res, next) =>
  next(new NotFoundError("Id provided not found"))
);

module.exports = router;
