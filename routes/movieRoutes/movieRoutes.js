const express = require("express");
const _ = require("lodash");

const { Movie, validateMovie } = require("../../imports/models/models");

const {
  admin,
  asyncMiddleware,
  auth,
} = require("../../imports/middleware/middleware");

const router = express.Router();

router.get(
  "/page/:page",
  auth,
  asyncMiddleware(async (req, res) => {
    const DOCUMENT_PER_PAGE = 2;
    const documentToSkipForThisPage = (req.params.page - 1) * DOCUMENT_PER_PAGE;
    const movie = await Movie.find()
      .sort("name")
      .skip(documentToSkipForThisPage)
      .limit(DOCUMENT_PER_PAGE);
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
    const getMovieDetails = await Movie.findOne({
      _id: req.params.movieId,
    });

    return res.status(200).send(getMovieDetails);
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
