/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('spots', {
  spotId: {
    type: DataTypes.INTEGER,
    field: 'spot_id',
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
  name: {
    type: DataTypes.STRING,
    field: 'name',
    allowNull: true,
  },
  placeId: {
    type: DataTypes.STRING,
    field: 'place_id',
    allowNull: true,
  },
  location: {
    type: DataTypes.INTEGER,
    field: 'location',
    allowNull: true,
  },
  neighborhoodId: {
    type: DataTypes.INTEGER,
    field: 'neighborhood_id',
    allowNull: true,
    references: {
      model: 'neighborhoods',
      key: 'neighborhood_id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  },
}, {
  schema: 'public',
  tableName: 'spots',
  timestamps: false,
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { spots } = model;
  const { sections } = model;
  const { neighborhoods } = model;
  const { activities } = model;

  spots.hasMany(sections, {
    as: 'sectionsSpotIdFkeys',
    foreignKey: 'spot_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  spots.belongsTo(neighborhoods, {
    as: 'neighborhood',
    foreignKey: 'neighborhood_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  spots.belongsToMany(activities, {
    as: 'activities',
    through: sections,
    foreignKey: 'spot_id',
    otherKey: 'activity_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
