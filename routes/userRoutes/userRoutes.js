const { User, validateUser } = require("../../imports/models/models");
const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
require("../../database/mongoose");
const {
  admin,
  asyncMiddleware,
  auth,
} = require("../../imports/middleware/middleware");

const router = express.Router();

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const validUserSchema = validateUser(req.body);
    if (validUserSchema.error) {
      return res.status(400).send(validUserSchema.error.details[0].message);
    }

    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(400).send("User already exist");
    }
    user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = await user.generateAuthToken();
    res
      .header(`x-auth-token`, token)
      .send(_.pick(user, ["_id", "name", "email", "password", "isAdmin"]));
  })
);

router.get(
  "/page/:page",
  auth,
  asyncMiddleware(async (req, res) => {
    const DOCUMENT_PER_PAGE = 2;
    const documentToSkipForThisPage = (req.params.page - 1) * DOCUMENT_PER_PAGE;

    const users = await User.find({})
      .select("-password")
      .skip(documentToSkipForThisPage)
      .limit(DOCUMENT_PER_PAGE);
    res.send(users);
  })
);
router.get(
  "/:userId",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await User.find({
      _id: req.params.userId,
    }).select("-password");
    return res.status(200).send(user);
  })
);
router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    await User.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).send("Deleted");
  })
);

module.exports = router;
