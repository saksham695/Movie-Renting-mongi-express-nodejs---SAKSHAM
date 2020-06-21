const mongoose = require("mongoose");
const joi = require("joi");
const Rentals = mongoose.model(
  "Rentals",
  new mongoose.Schema({
    name: {
      type: String,
    },
    Movie: {
      type: String,
    },
    dateOut: {
      type: String,
    },
    dateReturned: {
      type: String,
    },
    rentalFee: {
      type: Number,
      minimum: 0,
    },
    damageCharges: {
      type: Number,
    },
  })
);

const validateRentals = (rental) => {
  const schema = {
    name: joi.string().min(4).max(50).required(),
  };
  return joi.validate(rental, schema);
};

module.exports.Rentals = Rentals;
module.exports.validateRentals = validateRentals;
