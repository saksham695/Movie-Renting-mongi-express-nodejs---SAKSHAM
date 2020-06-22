const express = require("express");
const _ = require("lodash");

const {
  Customer,
  Movie,
  Rentals,
  validateCustomer,
} = require("../../imports/models/models");

const {
  admin,
  asyncMiddleware,
  auth,
  calculateDays,
  currentDate,
} = require("../../imports/middleware/middleware");

const router = express.Router();

router.get(
  "/detail/:page",
  auth,
  asyncMiddleware(async (req, res) => {
    const DOCUMENT_PER_PAGE = 2;
    const documentToSkipForThisPage = (req.params.page - 1) * DOCUMENT_PER_PAGE;
    const customer = await Customer.find()
      .sort("name")
      .skip(documentToSkipForThisPage)
      .limit(DOCUMENT_PER_PAGE);
    res.send(customer);
  })
);

router.post(
  "/rent",
  [auth, currentDate],
  asyncMiddleware(async (req, res) => {
    const validCustomerSchema = validateCustomer(req.body);
    if (validCustomerSchema.error) {
      res.status(400).send(validCustomerSchema.error.details[0].message);
    }
    const customer = await new Customer(
      _.pick(req.body, ["name", "phone", "movie"])
    );
    const movie = await Movie.findOne({
      name: customer.movie,
    });
    if (movie) {
      const newStock = movie.numberInStock - 1;
      await Movie.updateOne(
        { name: customer.movie },
        { $set: { numberInStock: newStock } },
        {
          new: true,
        }
      );
      const rental = await new Rentals({
        name: customer.name,
        Movie: customer.movie,
        dateOut: req.requestDate,
        dateReturned: null,
        rentalFee: movie.dailyRentalRate,
        damageCharges: 0,
      });
      await rental.save();
      await customer.save();
      await movie.save();
      return res.send(_.pick(customer, ["name", "phone", "movie"]));
    }
    return res.status(404).send("Movie Not available");
  })
);

router.patch(
  "/return",
  [auth, currentDate],
  asyncMiddleware(async (req, res) => {
    //find customer
    const customer = await Customer.findOne({
      name: req.body.name,
      movie: req.body.movie,
    });
    if (customer) {
      //find movie
      const movie = await Movie.findOne({
        name: customer.movie,
      });
      if (movie) {
        // update movie quantity

        const newStock = movie.numberInStock + 1;
        await Movie.findOneAndUpdate(
          { name: req.body.movie },
          { $set: { numberInStock: newStock } },
          {
            new: true,
          }
        );
        //update rental;
        const rentalInformation = await Rentals.findOne({
          name: req.body.name,
          Movie: req.body.movie,
        });
        const rentStartDate = rentalInformation.dateOut;
        const rentEndDate = req.requestDate;

        const totalDaysOfRent = calculateDays(rentStartDate, rentEndDate);
        const totalRent = totalDaysOfRent * movie.dailyRentalRate;
        console.log("RENT DETAILS", totalDaysOfRent, totalRent);
        await Rentals.findOneAndUpdate(
          {
            name: req.body.name,
          },
          {
            $set: {
              dateReturned: rentEndDate,
              rentalFee: totalRent,
            },
          },
          {
            new: true,
          }
        );
      }
    }

    res.send("Customer Details Updated and Movie count updated");
  })
);

router.get(
  "/:searchByItemValue/:page",
  auth,
  asyncMiddleware(async (req, res) => {
    const DOCUMENT_PER_PAGE = 2;
    const documentToSkipForThisPage = (req.params.page - 1) * DOCUMENT_PER_PAGE;
    const customer = await Customer.find({
      $or: [
        { name: req.params.searchByItemValue },
        { movie: req.params.searchByItemValue },
      ],
    })
      .skip(documentToSkipForThisPage)
      .limit(DOCUMENT_PER_PAGE);
    res.status(200).send(customer);
  })
);

router.get(
  "/:customerId",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await Customer.find({
      _id: req.params.customerId,
    });
    res.status(200).send(user);
  })
);

router.patch(
  "/:customerId",
  auth,
  asyncMiddleware(async (req, res) => {
    const updateCustomerDetails = await Customer.findByIdAndUpdate(
      {
        _id: req.params.customerId,
      },
      {
        $set: {
          phone: req.body.phone,
          name: req.body.name,
        },
      }
    );
    if (!updateCustomerDetails) {
      return res.status(400).send("User does not exist");
    }
    return res.send(updateCustomerDetails);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    await Customer.findByIdAndDelete({
      _id: req.params.id,
    });
  })
);

module.exports = router;
