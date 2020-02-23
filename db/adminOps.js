const models = require('./models');

const createDatePlan = async ({ date }) => {
  console.log(new Date(), 'Creating new date plan named', date.name);
  // return models.dates.create(date);
};


/*

date: {
  id,
  name,
  description,
  sections: [
    {
      id,
      spotId,
      activityId,
      minutes,
      cost,
      description,
      tips,
      image,
      imageAuthor,
      tags: [

      ],
    },
  ].
}

*/

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

  await Promise.all(date.sections.map(async (section) => {
    // Update section top-level data
    await models.sections.update({
      minutes: section.minutes,
      cost: section.cost,
      description: section.description,
      tips: section.tips,
      image: section.image,
      imageAuthor: section.imageAuthor,
      activityId: section.activityId,
    }, {
      where: {
        id: section.id,
      },
    });

    // Update tags
    const tagIds = section.tags.map(tag => tag.tagId);
    await models.sectionsTags.destroy({
      where: {
        sectionId: section.id,
      },
    });
    await Promise.all(tagIds.map(tagId => models.sectionsTags.create({
      id: Math.round(Math.random() * 2147483646),
      tagId,
      sectionId: section.id,
    })));


    // Update spot data
    await models.spots.update({
      name: section.spot.name,
      placeId: section.spot.placeId,
      neighborhoodId: section.spot.neighborhoodId,
    }, {
      where: {
        spotId: section.spot.spotId,
      },
    });
  }));
};

module.exports = {
  createDatePlan,
  updateDatePlan,
};
