const router = require("express").Router();
const { Joi, celebrate } = require("celebrate");
const auth = require("../middleware/auth");

const { getUser, updateUser } = require("../controllers/users");

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().required(),
  }),
});

router.get("/me", auth, getUser);
router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;
