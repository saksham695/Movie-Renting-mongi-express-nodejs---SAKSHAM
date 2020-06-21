const { Movie, validateMovie } = require("../../models/movie/movies");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const asyncMiddleware = require("../../middleware/asyncMiddleware");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const movie = await Movie.find().sort("name");
    res.send(movie);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const validMovieSchema = validateMovie(req.body);

    if (validMovieSchema.error) {
      return res.status(400).send(validMovieSchema.error.details[0].message);
    }

    let movie = await Movie.findOne({
      name: req.body.name,
    });
    console.log(movie);

    if (movie) {
      return res.status(400).send("Movie already exist");
    }

    movie = new Movie(
      _.pick(req.body, ["name", "numberInStock", "dailyRentalRate"])
    );

    console.log(req.body);

    await movie.save();
    res.send(_.pick(movie, ["name", "numberInStock", "dailyRentalRate"]));
  })
);

router.get(
  "/:movieId",
  auth,
  asyncMiddleware(async (req, res) => {
    const getMovieDetails = await Movie.find({
      _id: req.params.movieId,
    });
    console.log(updateMovieDetails);

    res.status(200).send(getMovieDetails);
  })
);

router.patch(
  "/:movieId",
  auth,
  asyncMiddleware(async (req, res) => {
    const updateMovieDetails = await Movie.findByIdAndUpdate(
      {
        _id: req.params.movieId,
      },
      {
        $set: {
          name: req.body.name,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
      },
      {
        new: true,
      }
    );
    res.send(updateMovieDetails);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    await Movie.findByIdAndDelete({
      _id: req.params.id,
    });

    res.status(200).send("Deleted Successfully");
  })
);

module.exports = router;
