const Sequelize = require('sequelize');

const dbUrl = process.env.DATABASE_URL || console.error('Missing database url!');

const models = require('./models');
const adminOps = require('./adminOps');

const hideLastName = (user) => {
  if (user.hideLastName) {
    const [first, last] = user.name.split(' ');
    if (last) {
      user.name = `${first} ${last[0]}.`;
    }
  }
};

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    useUTC: false, // for reading from database
  },
  // timezone: '-05:00', // for writing to database
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

const getUser = async (email) => {
  const user = await models.users.findOne({
    where: {
      email,
    },
  });
  return user;
};

const getOrSetUser = async ({ email, name, picture }) => {
  if (!email) {
    throw new Error('Cannot login user - provided email is empty or null', email);
  }

  const [user] = await models.users.findOrCreate({
    where: {
      email,
    },
    defaults: {
      email,
    },
  });
  await models.users.update({
    name,
    imageUrl: picture,
    lastLoginAt: sequelize.fn('NOW'),
  }, {
    where: {
      email,
    },
  });
  return user;
};

const getDate = async (id) => models.dates.findOne({
  where: {
    id,
  },
});

const getAllDates = async () => {
  const dates = await models.dates.findAll({
    order: [
      // Make sure sections are in order
      [{ model: models.sections, as: 'sections' }, 'sectionNumber', 'ASC'],
      [{ model: models.comments, as: 'comments' }, 'createdAt', 'DESC'],
    ],
    include: [{
      model: models.sections,
      as: 'sections',
      attributes: [
        'cost',
        'createdAt',
        'description',
        'id',
        'image',
        'imageAuthor',
        'minutes',
        'sectionNumber',
        'spotId',
        'tips',
        'updatedAt',
      ],
      include: [{
        model: models.tags,
        as: 'tags',
        attributes: ['name', 'tagId'],
      }, {
        model: models.spots,
        as: 'spot',
        include: [{
          model: models.neighborhoods,
          as: 'neighborhood',
        }],
      }],
    }, {
      model: models.comments,
      as: 'comments',
      attributes: ['id', 'content', 'createdAt'],
      include: [{
        model: models.users,
        as: 'user',
        attributes: ['id', 'name', 'imageUrl'],
      }],
    }],
  });

  dates.forEach((date) => {
    date.comments.map((comment) => {
      // eslint-disable-next-line no-param-reassign
      ([comment.user.name] = comment?.user?.name?.split(' '));
      return comment;
    });
  });

  return dates;
};

const getAllTags = async () => {
  const tags = await models.tags.findAll();
  return tags;
};

const getAllUsers = async () => {
  const users = await models.users.findAll({
    attributes: [
      'createdAt',
      'name',
      'id',
      'imageUrl',
      'bio',
      'dob',
      'relationshipStatus',
      'favoriteNeighborhoods',
      'dateSpecialties',
      'secretTalent',
      'firstDate',
      'instagram',
      'twitter',
      'isNew',
      'hideLastName',
    ],
    where: {
      isCreator: true,
    },
  });
  users.forEach(hideLastName);
  return users;
};

const getCurrentUser = async (email) => {
  const user = await models.users.findOne({
    where: {
      email,
    },
  });
  hideLastName(user);
  return user;
};

const updateUser = async ({ email, userData }) => {
  console.log(new Date(), 'Updating user data for', email, userData);
  const currentUserData = await models.users.findOne({ where: { email } });

  return models.users.update(userData, {
    where: {
      id: currentUserData.id,
    },
  });
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

const getLikedDates = async (email) => {
  console.log(new Date(), 'Getting liked dates for', email);
  const { id } = await models.users.findOne({ where: { email } });
  const likedDates = await models.likedDates.findAll({ where: { user_id: id } });
  return likedDates;
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

const likeDate = async ({ email, dateId }) => {
  console.log(new Date(), 'Liking date', dateId, 'for user', email);
  const { id } = await models.users.findOne({ where: { email } });
  try {
    const likedDate = await models.likedDates.findOne({
      where: {
        userId: id,
        dateId: parseInt(dateId, 10),
      },
    });
    if (likedDate) {
      console.log('Existing liked date found - doing nothing.');
      return null;
    }
  } catch (err) { console.log('No existing liked date found'); }
  return models.likedDates.create({
    userId: id,
    dateId: parseInt(dateId, 10),
  });
};

const addComment = async ({ email, dateId, content }) => {
  console.log(new Date(), 'Adding comment for date', dateId, 'for user', email);
  const { id } = await models.users.findOne({ where: { email } });
  return models.comments.create({
    userId: id,
    dateId: parseInt(dateId, 10),
    content,
  });
};

const deleteComment = async ({ email, commentId }) => {
  console.log(new Date(), 'Deleting comment with id', commentId, 'for user', email);
  const { id } = await models.users.findOne({ where: { email } });
  return models.comments.destroy({
    where: {
      userId: id,
      id: parseInt(commentId, 10),
    },
  });
};

const unlikeDate = async ({ email, dateId }) => {
  console.log(new Date(), 'Unliking date', dateId, 'for user', email);
  const { id } = await models.users.findOne({ where: { email } });

  return models.likedDates.destroy({
    where: {
      userId: id,
      dateId: parseInt(dateId, 10),
    },
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
  getUser,
  getOrSetUser,
  getDate,
  getAllDates,
  getAllNeighborhoods,
  getAllTags,
  getAllUsers,
  getCurrentUser,
  updateUser,
  getAllActivities,
  getUserDates,
  getLikedDates,
  createUserDate,
  updateUserDate,
  likeDate,
  unlikeDate,
  deleteUserDate,
  addComment,
  deleteComment,
  ...adminOps(sequelize),
};
