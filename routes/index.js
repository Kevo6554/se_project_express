const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const itemRouter = require("./clothingItems");

const userRoutes = require("./users");

router.use("/users", userRoutes);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Id provided not found" });
});

module.exports = router;
