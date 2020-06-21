const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Rentals } = require("../../models/rental/rentals");
const asyncMiddleware = require("../../middleware/asyncMiddleware");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const rental = await Rentals.find().sort("dateOut");
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
