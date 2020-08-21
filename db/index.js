const Sequelize = require('sequelize');

let dbUrl;
try {
  const dbConfig = require('./db-config.json'); // eslint-disable-line global-require
  dbUrl = dbConfig.dbUrl; // eslint-disable-line prefer-destructuring
} catch (e) {
  console.warn(e); // eslint-disable-line no-console
  dbUrl = process.env.DATABASE_URL;
}

const models = require('./models');
const adminOps = require('./adminOps');

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true,
  },
  logging: false,
});

models.init(sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const getOrSetUser = async ({ email, name, picture }) => {
  if (!email) {
    throw new Error('Cannot login user - provided email is empty or null', email);
  }

  await models.users.findOrCreate({
    where: {
      email,
    },
    defaults: {
      email,
    },
  });
  await models.users.update({
    name,
    image_url: picture,
    last_login_at: sequelize.fn('NOW'),
  }, {
    where: {
      email,
    },
  });
};

const getAllDates = async () => {
  const dates = await models.dates.findAll({
    order: [
      // Make sure sections are in order
      [{ model: models.sections, as: 'sections' }, 'sectionNumber', 'ASC'],
    ],
    include: [{
      model: models.sections,
      as: 'sections',
      include: [{
        model: models.tags,
        as: 'tags',
      }, {
        model: models.spots,
        as: 'spot',
        include: [{
          model: models.neighborhoods,
          as: 'neighborhood',
        }],
      }],
    }],
  });
  return dates;
};

const getAllTags = async () => {
  const tags = await models.tags.findAll();
  return tags;
};

const getAllActivities = async () => {
  const activities = await models.activities.findAll();
  return activities;
};

const getAllNeighborhoods = async () => {
  const neighborhoods = await models.neighborhoods.findAll();
  return neighborhoods;
};

const getUserDates = async (email) => {
  console.log(new Date(), 'Getting user dates for', email);
  const { id } = await models.users.findOne({ where: { email } });
  const userDates = await models.datesUsers.findAll({ where: { user_id: id } });
  return userDates;
};

const createUserDate = async ({ email, userDate }) => {
  console.log(new Date(), 'Creating user date for', email, userDate);
  const { id } = await models.users.findOne({ where: { email } });
  return models.datesUsers.create({
    userId: id,
    dateId: userDate.dateId,
    name: userDate.name,
    notes: userDate.notes,
    startTime: userDate.startTime,
  });
};

const updateUserDate = async ({ email, userDate }) => {
  console.log(new Date(), 'Updating user date for', email, userDate);
  const { id } = await models.users.findOne({ where: { email } });
  const { userId } = await models.datesUsers.findOne({ where: { id: userDate.id } });

  if (userId !== id) {
    throw Error('Unauthorized');
  }

  return models.datesUsers.update({
    name: userDate.name,
    notes: userDate.notes,
    startTime: userDate.startTime,
  }, {
    where: {
      id: userDate.id,
    },
  });
};

const deleteUserDate = async ({ email, userDate }) => {
  console.log(new Date(), 'Deleting user date for', email, userDate);
  const { id } = await models.users.findOne({ where: { email } });
  const { userId } = await models.datesUsers.findOne({ where: { id: userDate.id } });

  if (userId !== id) {
    throw Error('Unauthorized');
  }

  return models.datesUsers.destroy({
    where: {
      id: userDate.id,
    },
  });
};

module.exports = {
  getOrSetUser,
  getAllDates,
  getAllNeighborhoods,
  getAllTags,
  getAllActivities,
  getUserDates,
  createUserDate,
  updateUserDate,
  deleteUserDate,
  ...adminOps(sequelize),
};
