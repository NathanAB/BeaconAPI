/* eslint global-require: "off" */
const model = {};
let initialized = false;

/**
 * Initializes sequelize models and their relations.
 * @param   {Object} sequelize  - Sequelize instance.
 * @returns {Object}            - Sequelize models.
 */
function init(sequelize) {
  delete module.exports.init; // Destroy itself to prevent repeated calls and clash with a model named 'init'.
  initialized = true;
  // Import model files and assign them to `model` object.
  model.activities = sequelize.import('./definition/activities.js');
  model.categories = sequelize.import('./definition/categories.js');
  model.dates = sequelize.import('./definition/dates.js');
  model.datesSections = sequelize.import('./definition/dates-sections.js');
  model.datesUsers = sequelize.import('./definition/dates-users.js');
  model.neighborhoods = sequelize.import('./definition/neighborhoods.js');
  model.sections = sequelize.import('./definition/sections.js');
  model.sectionsTags = sequelize.import('./definition/sections-tags.js');
  model.spots = sequelize.import('./definition/spots.js');
  model.tags = sequelize.import('./definition/tags.js');
  model.users = sequelize.import('./definition/users.js');
  model.likedDates = sequelize.import('./definition/liked-dates.js');

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
