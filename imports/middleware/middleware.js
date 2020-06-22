const asyncMiddleware = require("../../middleware/asyncMiddleware");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const currentDate = require("../../middleware/dateMiddleWare");
const calculateDays = require("../../utils/rentDates");

module.exports = {
  admin: admin,
  asyncMiddleware: asyncMiddleware,
  auth: auth,
  calculateDays: calculateDays,
  currentDate: currentDate,
};
