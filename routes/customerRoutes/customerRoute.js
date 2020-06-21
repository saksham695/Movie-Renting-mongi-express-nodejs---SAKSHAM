const {
  Customer,
  validateCustomer,
} = require("../../models/customer/customers");
const { Movie } = require("../../models/movie/movies");
const { Rentals } = require("../../models/rental/rentals");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const asyncMiddleware = require("../../middleware/asyncMiddleware");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const currentDate = require("../../middleware/dateMiddleWare");
const calculateDays = require("../../utils/rentDates");
router.get(
  "/detail",
  auth,
  asyncMiddleware(async (req, res) => {
    const customer = await Customer.find().sort("name");
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
    }
    await customer.save();
    await movie.save();
    res.send(_.pick(customer, ["name", "phone", "movie"]));
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

    res.send(
      "customer record deleted from customer table and movie updated in stocks and you will find the total amount of rent in rentals table"
    );
  })
);

router.get(
  "/:searchByItemValue",
  auth,
  asyncMiddleware(async (req, res) => {
    const customer = await Customer.find({
      $or: [
        { name: req.params.searchByItemValue },
        { Movie: req.params.searchByItemValue },
      ],
    });
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
    console.log(updateCustomerDetails);
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
