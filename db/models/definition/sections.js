/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('sections', {
  id: {
    type: DataTypes.INTEGER,
    field: 'id',
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: true,
  },
  spotId: {
    type: DataTypes.INTEGER,
    field: 'spot_id',
    allowNull: true,
    references: {
      model: 'spots',
      key: 'spot_id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  },
  activityId: {
    type: DataTypes.INTEGER,
    field: 'activity_id',
    allowNull: true,
    references: {
      model: 'activities',
      key: 'activity_id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  },
  sectionName: {
    type: DataTypes.STRING,
    field: 'section_name',
    allowNull: true,
  },
  minutes: {
    type: DataTypes.INTEGER,
    field: 'minutes',
    allowNull: true,
  },
  cost: {
    type: DataTypes.INTEGER,
    field: 'cost',
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    field: 'description',
    allowNull: true,
  },
  tips: {
    type: DataTypes.STRING,
    field: 'tips',
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    field: 'image',
    allowNull: true,
  },
  imageAuthor: {
    type: DataTypes.STRING,
    field: 'imageAuthor',
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    field: 'rating',
    allowNull: true,
  },
  sectionNumber: {
    type: DataTypes.INTEGER,
    field: 'sectionNumber',
    allowNull: true,
  },
}, {
  schema: 'public',
  tableName: 'sections',
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { sections } = model;
  const { datesSections } = model;
  const { sectionsTags } = model;
  const { activities } = model;
  const { spots } = model;
  const { dates } = model;
  const { tags } = model;

  sections.hasMany(datesSections, {
    as: 'datesSectionsSectionIdFkeys',
    foreignKey: 'section_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  sections.hasMany(sectionsTags, {
    as: 'tagsSectionIdFkeys',
    foreignKey: 'section_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  sections.belongsTo(activities, {
    as: 'activity',
    foreignKey: 'activity_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  sections.belongsTo(spots, {
    as: 'spot',
    foreignKey: 'spot_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  sections.belongsToMany(dates, {
    as: 'dates',
    through: datesSections,
    foreignKey: 'section_id',
    otherKey: 'date_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  sections.belongsToMany(tags, {
    as: 'tags',
    through: sectionsTags,
    foreignKey: 'section_id',
    otherKey: 'tag_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
