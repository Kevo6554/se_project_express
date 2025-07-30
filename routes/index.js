const router = require("express").Router();
const { NotFoundError } = require("../utils/errors");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

const userRoutes = require("./users");

router.use("/users", userRoutes);
router.use("/items", itemRouter);

router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res, next) =>
  next(new NotFoundError("Id provided not found"))
);

module.exports = router;
