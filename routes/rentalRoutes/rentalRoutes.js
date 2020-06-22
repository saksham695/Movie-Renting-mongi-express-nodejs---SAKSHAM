const express = require("express");
const _ = require("lodash");
const { Rentals } = require("../../imports/models/models");
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
    const rental = await Rentals.find()
      .sort("dateOut")
      .skip(documentToSkipForThisPage)
      .limit(DOCUMENT_PER_PAGE);
    res.send(rental);
  })
);
router.get(
  "/:searchByItemValue",
  auth,
  asyncMiddleware(async (req, res) => {
    const rentals = await Rentals.find({
      $or: [
        { name: req.params.searchByItemValue },
        { Movie: req.params.searchByItemValue },
      ],
    });
    res.status(200).send(rentals);
  })
);
router.patch(
  "/:rentalId",
  auth,
  asyncMiddleware(async (req, res) => {
    const updateMovieDetails = await Movie.findByIdAndUpdate(
      {
        _id: req.params.rentalId,
      },
      {
        $set: {
          name: req.body.name,
          Movie: req.body.Movie,
          damageCharges: req.body.damageCharges,
        },
      },
      {
        new: true,
      }
    );
    res.send(updateMovieDetails);
  })
);
router.get(
  "/movie/:movieName/customer/:customerName",
  auth,
  asyncMiddleware(async (req, res) => {
    console.log(req.params);
    const rentals = await Rentals.find({
      name: req.params.customerName,
      Movie: req.params.movieName,
    });
    console.log(rentals);
    res.status(200).send(rentals);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    await Rentals.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).send("Deleted");
  })
);

module.exports = router;
