const router = require("express").Router();
const { SERVER_ERROR } = require("../utils/errors");
const itemRouter = require("./clothingItems");

const userRoutes = require("./users");

router.use("/users", userRoutes);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(SERVER_ERROR).send({ message: "Router not found" });
});

module.exports = router;
