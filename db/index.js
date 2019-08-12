const Sequelize = require('sequelize');

let dbConfig;
try {
  // eslint-disable-next-line global-require
  dbConfig = require('./db-config.json');
} catch (e) {
  console.error(e);
}

const models = require('./models');

const dbUrl = dbConfig.dbUrl || process.env.DATABASE_URL;
const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true,
  },
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

  await models.User.findOrCreate({
    where: {
      email,
    },
    defaults: {
      email,
    },
  });
  await models.User.update({
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

module.exports = {
  getOrSetUser,
  getAllDates,
};
