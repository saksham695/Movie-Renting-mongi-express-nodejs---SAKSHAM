const mongoose = require("mongoose");
const config = require("config");

const db = config.get("db");
console.log(db);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to mongo DB");
  })
  .catch(() => {
    console.log("unable to connect to mongo db");
  });
