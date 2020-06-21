const express = require("express");
const app = express();
const {
  Auth,
  Customer,
  Movie,
  Rentals,
  User,
} = require("./main-file-imports/index");

// TODO -validation check (done)
// TODO --deleting calls by admin (done)
// TODO ---get calls of individual movie(by name) , user(only admin) , rentals (by name) (by movie),customer(by name)(by movie)--->(done)
// TODO ----check if movie is available or not (done)
// TODO -----date middleware and rental fee calculation (done)
// TODO ------test cases and logging(added for movie routes)
// TODO -------pagination
// TODO --------cleaning imports(done)

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
