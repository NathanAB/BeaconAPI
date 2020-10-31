/* eslint global-require: "off" */
const Sequelize = require('sequelize');
const activities = require('./definition/activities');
const categories = require('./definition/categories');
const dates = require('./definition/dates');
const datesSections = require('./definition/dates-sections');
const datesUsers = require('./definition/dates-users');
const neighborhoods = require('./definition/neighborhoods');
const sections = require('./definition/sections');
const sectionsTags = require('./definition/sections-tags');
const spots = require('./definition/spots');
const tags = require('./definition/tags');
const users = require('./definition/users');
const likedDates = require('./definition/liked-dates');

const model = {};
let initialized = false;

/**
 * Initializes sequelize models and their relations.
 * @param   {Object} sequelize  - Sequelize instance.
 * @returns {Object}            - Sequelize models.
 */
function init(sequelize) {
  // Destroy itself to prevent repeated calls and clash with a model named 'init'.
  delete module.exports.init;
  initialized = true;
  // Import model files and assign them to `model` object.
  model.activities = activities(sequelize, Sequelize.DataTypes);
  model.categories = categories(sequelize, Sequelize.DataTypes);
  model.dates = dates(sequelize, Sequelize.DataTypes);
  model.datesSections = datesSections(sequelize, Sequelize.DataTypes);
  model.datesUsers = datesUsers(sequelize, Sequelize.DataTypes);
  model.neighborhoods = neighborhoods(sequelize, Sequelize.DataTypes);
  model.sections = sections(sequelize, Sequelize.DataTypes);
  model.sectionsTags = sectionsTags(sequelize, Sequelize.DataTypes);
  model.spots = spots(sequelize, Sequelize.DataTypes);
  model.tags = tags(sequelize, Sequelize.DataTypes);
  model.users = users(sequelize, Sequelize.DataTypes);
  model.likedDates = likedDates(sequelize, Sequelize.DataTypes);

  // All models are initialized. Now connect them with relations.
  require('./definition/activities.js').initRelations();
  require('./definition/categories.js').initRelations();
  require('./definition/dates.js').initRelations();
  require('./definition/dates-sections.js').initRelations();
  require('./definition/dates-users.js').initRelations();
  require('./definition/neighborhoods.js').initRelations();
  require('./definition/sections.js').initRelations();
  require('./definition/sections-tags.js').initRelations();
  require('./definition/spots.js').initRelations();
  require('./definition/tags.js').initRelations();
  require('./definition/users.js').initRelations();
  require('./definition/liked-dates.js').initRelations();
  return model;
}

// Note: While using this module, DO NOT FORGET FIRST CALL model.init(sequelize). Otherwise you get undefined.
module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;
