const Movie = require("../../routes/movieRoutes/movieRoutes");
const Customer = require("../../routes/customerRoutes/customerRoute");
const Rentals = require("../../routes/rentalRoutes/rentalRoutes");
const Auth = require("../../authentication/auth");
const User = require("../../routes/userRoutes/userRoutes");

module.exports = {
  Movie: Movie,
  Customer: Customer,
  Rentals: Rentals,
  Auth: Auth,
  User: User,
};
