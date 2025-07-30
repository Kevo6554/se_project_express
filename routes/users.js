const router = require("express").Router();
const { celebrate, Joi } = require("../middleware/validation");
const auth = require("../middleware/auth");

const { getUser, updateUser } = require("../controllers/users");

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi().required(),
    avatr: Joi.stringf().uri().required(),
  }),
});

router.get("/me", auth, getUser);
router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;
