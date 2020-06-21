const mongoose = require("mongoose");
const joi = require("joi");
const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    numberInStock: {
      type: Number,
    },
    dailyRentalRate: {
      type: Number,
    },
  })
);

const validateMovie = (movie) => {
  const schema = {
    name: joi.string().min(4).max(50).required(),
    numberInStock: joi.number().integer().required(),
    dailyRentalRate: joi.number().required(),
  };
  return joi.validate(movie, schema);
};

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
