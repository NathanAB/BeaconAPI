const models = require('./models');

/*
date: {
  id: 1,
  name: 'Drinks and a Laugh',
  description: 'Connect over a laugh and a brew at The Big Hunt. Longtime locals show up for one of the best happy hours in D.C. and stay for the comedy. Grab a few beers and find a cozy corner to hang and prepare to get lost in the laughs. Because laughing works up a real apetitie, stop over for something sweet at Luna Grill.\n',
  sections: [
    {
      id: 1,
      spotId: 1,
      activityId: 5,
      minutes: 90,
      cost: 1,
      description: "The Big Hunt has three floors, four bars, and 32 beers on tap. A great place to find a regular rotation of D.C's best comedians. The low key atmosphere in the Big Hunt invites you to stay a while. ",
      tips: '-When to go and special events: We recommend going to The Big Hunt on Wednesday, Thursday, Friday, or Saturday since those are nights that they host Underground Comedy. The best part? Many of these shows are free. The free shows are Wednesday at 8PM, Thursday at 8PM, Friday at 11:30PM, and Saturday at 11:30PM.',
      image: null,
      imageAuthor: null,
      activity_id: 5,
      spot_id: 1,
      datesSections: [Object],
      tags: [{
        tagId: 7
        name: "Intellectual"
        categoryId: 2
        category_id: 2
      }, {
        ...etc
      }],
      spot: {
        spotId: 2
        name: "Library of Congress"
        placeId: "ChIJTTr4jvbuDzkR7D7e9Jayy0Y"
        neighborhoodId: 0
        neighborhood_id: 0
      }
    },
    {
      ...etc
    }
  ]
}
*/

const genId = () => Math.round(Math.random() * 2147483646);

module.exports = sequelize => ({

  createDatePlan: async ({ date }) => {
    console.log(new Date(), 'Creating new date plan named', date.name);
    await sequelize.transaction(async (t) => {
      // - write dates
      // - each date.section
      //    - write spots
      //    - write sections
      //    - write sections_tags
      //    - write dates_sections

      const newDate = await models.dates.create({
        id: genId(),
        name: date.name,
        description: date.description,
        active: false,
      }, {
        transaction: t,
      });

      await Promise.all(date.sections.map(async (section) => {
        const newSpot = await models.spots.create({
          spotId: genId(),
          name: section.spot.name,
          placeId: section.spot.placeId,
          neighborhoodId: section.spot.neighborhoodId,
        }, {
          transaction: t,
        });

        const newSection = await models.sections.create({
          id: genId(),
          activityId: section.activityId,
          minutes: section.minutes,
          cost: section.cost,
          description: section.description,
          tips: section.tips,
          image: section.image,
          imageAuthor: section.imageAuthor,
          spotId: newSpot.spotId || newSpot.id,
        }, {
          transaction: t,
        });

        await Promise.all(section.tags.map(async (tag) => {
          await models.sectionsTags.create({
            id: genId(),
            sectionId: newSection.id,
            tagId: tag.tagId,
          }, {
            transaction: t,
          });
        }));

        await models.datesSections.create({
          id: genId(),
          sectionId: newSection.id,
          dateId: newDate.id,
        }, {
          transaction: t,
        });
      }));
    });
  },

  updateDatePlan: async ({ date }) => {
    console.log(new Date(), 'Updating date plan for', date.name);
    await sequelize.transaction(async (t) => {
      await models.dates.update({
        name: date.name,
        description: date.description,
        active: date.active,
      }, {
        where: {
          id: date.id,
        },
        transaction: t,
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
          transaction: t,
        });

        // Update tags
        const tagIds = section.tags.map(tag => tag.tagId);
        await models.sectionsTags.destroy({
          where: {
            sectionId: section.id,
          },
        });
        await Promise.all(tagIds.map(tagId => models.sectionsTags.create({
          id: genId(),
          tagId,
          sectionId: section.id,
        }, {

          transaction: t,
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
          transaction: t,
        });
      }));
    });
  },

});
