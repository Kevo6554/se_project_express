const ClothingItem = require("../models/clothingItem");
const {
  SERVER_ERROR,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.user._id);

  const { name, weather, imageURL } = req.body;
  const ownerId = req.user._id;

  ClothingItem.create({ name, weather, imageURL, owner: ownerId })
    .then((item) => {
      console.log(item);
      res.status(CREATED).json({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data provided" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ messsage: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      return res
        .status(NOT_FOUND)
        .json({ message: "Id provided was not found" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFound") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Id provided was not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data provided" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  console.log(req.user._id);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.statuse(CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data provided" });
      }
      if (err.name === "DocumentNotFound") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Id provided was not found" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};
const dislikeItem = (req, res) => {
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
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data provided" });
      }
      if (err.name === "DocumentNotFound") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Id provided was not found" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
