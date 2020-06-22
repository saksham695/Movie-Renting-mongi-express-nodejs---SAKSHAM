const express = require("express");
const app = express();
const {
  Auth,
  Customer,
  Movie,
  Rentals,
  User,
} = require("./imports/routes/routes");

app.use(express.json());

app.use("/api/signup", User);
app.use("/api/login", Auth);
app.use("/api/movies", Movie);
app.use("/api/customer", Customer);
app.use("/api/rental", Rentals);

const server = app.listen(5000, () => {
  console.log("Server is up on port 5000");
});

module.exports = server;
