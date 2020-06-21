function currentDate(req, res, next) {
  const date = new Date();
  const currentDate = `${date
    .getDate()
    .toString()}-${date
    .getMonth()
    .toString()}-${date.getFullYear().toString()}`;
  req.requestDate = currentDate;
  next();
}

module.exports = currentDate;
