const express = require("express");
const favoriteRouter = express.Router();
const cors = require("./cors");
const authenticate = require("../authenticate");
const Favorite = require("../model/favorite");

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((campsite) => {
            if (!favorite.campsites.includes(campsite._id)) {
              favorite.campsites.push(campsite._id);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user._id, campsites: req.body })
            .then((favorite) => {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          res.setHeader("Content-Type", "application/json");
          res.status(200).json(favorite);
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
            favorite
              .save()
              .then((favorite) => {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json(favorite);
              })
              .catch((err) => next(err));
          } else {
            res.setHeader("Content-Type", "text/plain");
            res
              .status(200)
              .send("That campsite is already in the list of favorites!");
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorite) => {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId);
          if (index >= 0) {
            favorite.campsites.splice(index, 1);
            favorite
              .save()
              .then((favorite) => {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json(favorite);
              })
              .catch((err) => next(err));
          } else {
            res.setHeader("Content-Type", "text/plain");
            res.end("Campsite not found in your favorites.");
          }
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  })
  .get((req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("GET operation not supported on /favorites/:campsiteId");
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not supported on /favorites/:campsiteId");
  });

module.exports = favoriteRouter;
