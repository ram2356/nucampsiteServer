const express = require("express");
const partnerRouter = express.Router();
const Partner = require("../model/partner");
const authenticate = require("../authenticate");
const cors = require("./cors");

partnerRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.find({})
      .then((partners) => {
        res.status(200).json(partners);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.create(req.body)
        .then((partner) => {
          res.status(201).json(partner);
        })
        .catch((err) => next(err));
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status(403).send("PUT operation not supported on /partners");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.deleteMany({})
        .then(() => {
          res.status(200).send("Successfully deleted all partners");
        })
        .catch((err) => next(err));
    }
  );

partnerRouter
  .route("/:partnerId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        if (!partner) {
          const err = new Error(`Partner ${req.params.partnerId} not found`);
          err.status = 404;
          throw err;
        }
        res.status(200).json(partner);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res
        .status(403)
        .send(
          `POST operation not supported on /partners/${req.params.partnerId}`
        );
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Partner.findByIdAndUpdate(
      req.params.partnerId,
      { $set: req.body },
      { new: true }
    )
      .then((updatedPartner) => {
        if (!updatedPartner) {
          const err = new Error(`Partner ${req.params.partnerId} not found`);
          err.status = 404;
          throw err;
        }
        res.status(200).json(updatedPartner);
      })
      .catch((err) => next(err));
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((deletedPartner) => {
          if (!deletedPartner) {
            const err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            throw err;
          }
          res.status(200).json(deletedPartner);
        })
        .catch((err) => next(err));
    }
  );

module.exports = partnerRouter;
