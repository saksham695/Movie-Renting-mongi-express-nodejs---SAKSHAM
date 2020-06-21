const mongoose = require("mongoose");
const joi = require("joi");
const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    phone: {
      type: Number,
      min: 1000000,
      max: 9999999999,
    },
    movie: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
  })
);

const validateCustomer = (customer) => {
  console.log("inside validation ");
  const schema = {
    name: joi.string().min(4).max(50).required(),
    phone: joi.number().greater(9999999).less(10000000000).required(),
    movie: joi.string().min(4).max(50).required(),
  };
  console.log("validation", joi.validate(customer, schema));
  return joi.validate(customer, schema);
};

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
