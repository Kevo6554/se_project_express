const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/like", dislikeItem);
router.use(auth);

module.exports = router;
