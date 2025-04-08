const router = require("express").Router();

const auth = require("../middleware/auth");

const { getUser, getUsers } = require("../controllers/users");

router.get("/me", auth, getUser);
router.patch("/me", auth, getUsers);

module.exports = router;
