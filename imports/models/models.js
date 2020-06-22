const {
  Customer,
  validateCustomer,
} = require("../../models/customer/customers");
const { Movie, validateMovie } = require("../../models/movie/movies");
const { Rentals, validateRentals } = require("../../models/rental/rentals");
const { User, validateUser } = require("../../models/user/users");

module.exports = {
  Movie: Movie,
  Customer: Customer,
  Rentals: Rentals,
  User: User,
  validateCustomer: validateCustomer,
  validateMovie: validateMovie,
  validateRentals: validateRentals,
  validateUser: validateUser,
};
