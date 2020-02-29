/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('activities', {
  activityId: {
    type: DataTypes.INTEGER,
    field: 'activity_id',
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
}, {
  schema: 'public',
  tableName: 'activities',
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const { activities } = model;
  const { sections } = model;
  const { spots } = model;

  activities.hasMany(sections, {
    as: 'sectionsActivityIdFkeys',
    foreignKey: 'activity_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  activities.belongsToMany(spots, {
    as: 'spots',
    through: sections,
    foreignKey: 'activity_id',
    otherKey: 'spot_id',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
};
