function asyncMiddleware(handle) {
  return async (req, res, next) => {
    console.log("hello");
    try {
      await handle(req, res);
    } catch (error) {
      console.log("Error", error.message);
      return res.status(400).send(error.message);
      next(error);
    }
  };
}
module.exports = asyncMiddleware;
