const router = require("express").Router();

const auth = require("../middleware/auth");

const { getUser, updateUser } = require("../controllers/users");

router.get("/me", auth, getUser);
router.patch("/me", auth, updateUser);

module.exports = router;
