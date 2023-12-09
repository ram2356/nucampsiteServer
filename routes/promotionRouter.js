const express = require("express");
const promotionRouter = express.Router();
const Promotion = require("../model/promotion");
const authenticate = require("../authenticate");

promotionRouter
  .route("/")
  .get((req, res, next) => {
    Promotion.find({})
      .then((promotions) => {
        res.status(200).json(promotions);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        res.status(201).json(promotion);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.status(403).send("PUT operation not supported on /promotions");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.deleteMany({})
        .then(() => {
          res.status(200).send("Successfully deleted all promotions");
        })
        .catch((err) => next(err));
    }
  );

promotionRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        if (!promotion) {
          const err = new Error(
            `Promotion ${req.params.promotionId} not found`
          );
          err.status = 404;
          throw err;
        }
        res.status(200).json(promotion);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res
      .status(403)
      .send(
        `POST operation not supported on /promotions/${req.params.promotionId}`
      );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      { $set: req.body },
      { new: true }
    )
      .then((updatedPromotion) => {
        if (!updatedPromotion) {
          const err = new Error(
            `Promotion ${req.params.promotionId} not found`
          );
          err.status = 404;
          throw err;
        }
        res.status(200).json(updatedPromotion);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.findByIdAndDelete(req.params.promotionId)
        .then((deletedPromotion) => {
          if (!deletedPromotion) {
            const err = new Error(
              `Promotion ${req.params.promotionId} not found`
            );
            err.status = 404;
            throw err;
          }
          res.status(200).json(deletedPromotion);
        })
        .catch((err) => next(err));
    }
  );

module.exports = promotionRouter;
