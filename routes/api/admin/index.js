const express = require('express');
const datePlan = require('./datePlan');
const { ADMINS } = require('./utils');

const checkAdmin = (req, res, next) => {
  if (!req.session) {
    res.sendStatus(401);
  }
  const { email } = req.session.passport.user.profile;

  if (!ADMINS.includes(email)) {
    res.sendStatus(403);
    console.error(`Non-admin ${email} is attempting to execute admin action!`);
  }

  if (!req.session.token) {
    res.cookie('token', '');
    res.sendStatus(401);
  }

  next();
};

module.exports = {
  createRouter: () => {
    const router = express.Router();
    router.use(checkAdmin);
    router.use(datePlan);
    return router;
  },
};
