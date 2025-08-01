const ClothingItem = require("../models/clothingItem");
const {
  CREATED,
  BadRequestError,
  NotFoundError,
  OK,
  ForbiddenError,
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
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
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
        throw new ForbiddenError("You are not authorized to delete this item");
      }
      return item
        .deleteOne()
        .then(() => res.status(OK).send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Id provided not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
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
        return next(new BadRequestError("Invalid data provided"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Id provided not found"));
      }
      return next(err);
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
        return next(new BadRequestError("Invalid data provided"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Id provided not found"));
      }
      return next(err);
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
