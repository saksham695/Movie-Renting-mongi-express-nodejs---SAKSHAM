function asyncMiddleware(handle) {
  return async (req, res, next) => {
    try {
      await handle(req, res);
    } catch (error) {
      res.status(400).send(error.message);
      next(error);
    }
  };
}
module.exports = asyncMiddleware;
