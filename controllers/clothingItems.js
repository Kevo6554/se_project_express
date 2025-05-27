const ClothingItem = require("../models/clothingItem");
const {
  SERVER_ERROR,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  OK,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;

  const ownerId = req.user._id;

  console.log({ name, weather, imageUrl, ownerId });
  return ClothingItem.create({ name, weather, imageUrl, owner: ownerId })
    .then((item) => {
      console.log(item);
      res.status(CREATED).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next({ statusCode: BAD_REQUEST, message: "Invalid data provided" });
      }
      next({
        statusCode: SERVER_ERROR,
        message: "An error has occurred on the server",
      });
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        next({
          statusCode: FORBIDDEN,
          message: "Cannot delete other users items",
        });
      }
      return item
        .deleteOne()
        .then(() => res.status(OK).send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next({ statusCode: NOT_FOUND, message: "Id provided was not found" });
      }
      if (err.name === "CastError") {
        next({ statusCode: BAD_REQUEST, message: "Invalid data provided" });
      }
      next({
        statusCode: SERVER_ERROR,
        message: "An error has occurred on the server",
      });
    });
};

const likeItem = (req, res, next) => {
  console.log(req.user._id);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next({ statusCode: BAD_REQUEST, message: "Invalid data provided" });
      }
      if (err.name === "DocumentNotFoundError") {
        next({ statusCode: NOT_FOUND, message: "Id provide was not found" });
      }
      next({
        statusCode: SERVER_ERROR,
        message: "An error has occurred on the server",
      });
    });
};
const dislikeItem = (req, res, next) => {
  console.log(req.user._id);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next({ statusCode: BAD_REQUEST, message: "Invalid data provided" });
      }
      if (err.name === "DocumentNotFoundError") {
        next({ statusCode: NOT_FOUND, message: "Id provided was not found" });
      }
      next({
        statusCode: SERVER_ERROR,
        message: "An error occurred on the server",
      });
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
