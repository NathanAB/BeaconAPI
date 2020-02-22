const models = require('./models');

const createDatePlan = async ({ date }) => {
  console.log(new Date(), 'Creating new date plan named', date.name);
  // return models.dates.create(date);
};

const updateDatePlan = async ({ date }) => {
  console.log(new Date(), 'Updating date plan for', date.name);

  await models.dates.update({
    name: date.name,
    description: date.description,
  }, {
    where: {
      id: date.id,
    },
  });

  await Promise.all(date.sections.map(section => models.section.update({
    spotId: section.spotId,
    activityId: section.activityId,
    minutes: section.minutes,
    cost: section.cost,
    description: section.description,
    tips: section.tips,
    image: section.tips,
    imageAuthor: section.imageAuthor,
  }, {
    where: {
      id: section.id,
    },
  })));
};

module.exports = {
  createDatePlan,
  updateDatePlan,
};
